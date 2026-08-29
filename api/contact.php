<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\Exception as MailerException;
use PHPMailer\PHPMailer\PHPMailer;

ini_set('display_errors', '0');
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

const MAX_REQUEST_BYTES = 7 * 1024 * 1024;
const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;
const RATE_WINDOW_SECONDS = 900;
const RATE_MAX_REQUESTS = 5;

$requestId = bin2hex(random_bytes(8));
$responseLanguage = 'fr';

function translated_message(string $message, string $language): string
{
    if ($language === 'fr') return $message;
    $translations = [
        'en' => [
            'Valeur invalide.' => 'Invalid value.', 'Ce champ est obligatoire.' => 'This field is required.', 'Ce champ est trop long.' => 'This field is too long.',
            'Trop de tentatives ont été effectuées. Réessayez dans quelques minutes.' => 'Too many attempts have been made. Please try again in a few minutes.',
            'Cette ressource accepte uniquement les requêtes POST.' => 'This resource only accepts POST requests.', 'Le format de la requête n’est pas accepté.' => 'The request format is not accepted.', 'La requête dépasse la taille autorisée.' => 'The request exceeds the allowed size.', 'La demande n’a pas pu être traitée.' => 'The request could not be processed.',
            'Adresse e-mail invalide.' => 'Invalid email address.', 'Sujet invalide.' => 'Invalid subject.', 'Destinataire invalide.' => 'Invalid recipient.', 'Votre accord est nécessaire.' => 'Your consent is required.',
            'Pièce jointe invalide.' => 'Invalid attachment.', 'Le fichier dépasse la limite de 5 Mo.' => 'The file exceeds the 5 MB limit.', 'Le transfert du fichier a échoué.' => 'The file upload failed.', 'Le fichier est vide.' => 'The file is empty.', 'Le contrôle de la pièce jointe est temporairement indisponible.' => 'Attachment verification is temporarily unavailable.', 'Le type réel du fichier n’est pas autorisé.' => 'The actual file type is not allowed.',
            'Vérifiez les informations saisies.' => 'Check the information entered.', 'Votre message a bien été envoyé.' => 'Your message has been sent.', 'Le message n’a pas pu être envoyé. Vos informations sont conservées afin que vous puissiez réessayer.' => 'The message could not be sent. Your information has been retained so you can try again.'
        ],
        'nl' => [
            'Valeur invalide.' => 'Ongeldige waarde.', 'Ce champ est obligatoire.' => 'Dit veld is verplicht.', 'Ce champ est trop long.' => 'Dit veld is te lang.',
            'Trop de tentatives ont été effectuées. Réessayez dans quelques minutes.' => 'Te veel pogingen. Probeer het over enkele minuten opnieuw.',
            'Cette ressource accepte uniquement les requêtes POST.' => 'Deze bron accepteert alleen POST-verzoeken.', 'Le format de la requête n’est pas accepté.' => 'Het formaat van het verzoek wordt niet aanvaard.', 'La requête dépasse la taille autorisée.' => 'Het verzoek overschrijdt de toegestane grootte.', 'La demande n’a pas pu être traitée.' => 'Het verzoek kon niet worden verwerkt.',
            'Adresse e-mail invalide.' => 'Ongeldig e-mailadres.', 'Sujet invalide.' => 'Ongeldig onderwerp.', 'Destinataire invalide.' => 'Ongeldige ontvanger.', 'Votre accord est nécessaire.' => 'Je toestemming is vereist.',
            'Pièce jointe invalide.' => 'Ongeldige bijlage.', 'Le fichier dépasse la limite de 5 Mo.' => 'Het bestand is groter dan 5 MB.', 'Le transfert du fichier a échoué.' => 'Het uploaden van het bestand is mislukt.', 'Le fichier est vide.' => 'Het bestand is leeg.', 'Le contrôle de la pièce jointe est temporairement indisponible.' => 'De controle van de bijlage is tijdelijk niet beschikbaar.', 'Le type réel du fichier n’est pas autorisé.' => 'Het werkelijke bestandstype is niet toegestaan.',
            'Vérifiez les informations saisies.' => 'Controleer de ingevulde gegevens.', 'Votre message a bien été envoyé.' => 'Je bericht is verzonden.', 'Le message n’a pas pu être envoyé. Vos informations sont conservées afin que vous puissiez réessayer.' => 'Het bericht kon niet worden verzonden. Je gegevens zijn bewaard zodat je het opnieuw kunt proberen.'
        ],
    ];
    return $translations[$language][$message] ?? $message;
}

function respond(int $status, bool $success, string $code, string $message, array $errors = []): void
{
    global $responseLanguage;
    http_response_code($status);
    $payload = ['success' => $success, 'code' => $code, 'message' => translated_message($message, $responseLanguage)];
    if ($errors !== []) $payload['errors'] = array_map(static fn ($error): string => translated_message((string) $error, $responseLanguage), $errors);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function text_field(string $name, int $maximum, bool $required, array &$errors): string
{
    $value = $_POST[$name] ?? '';
    if (!is_string($value)) {
        $errors[$name] = 'Valeur invalide.';
        return '';
    }
    $value = trim(str_replace("\0", '', $value));
    $length = function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
    if ($required && $value === '') $errors[$name] = 'Ce champ est obligatoire.';
    elseif ($length > $maximum) $errors[$name] = 'Ce champ est trop long.';
    return $value;
}

function client_rate_key(): string
{
    // Do not trust forwarding headers until the exact OVH proxy topology is known.
    return hash('sha256', (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
}

function cleanup_rate_files(string $directory): void
{
    if (random_int(1, 100) !== 1) return;
    $threshold = time() - 86400;
    foreach (glob($directory . DIRECTORY_SEPARATOR . '*.json') ?: [] as $path) {
        if (is_file($path) && filemtime($path) < $threshold) @unlink($path);
    }
}

function enforce_rate_limit(): void
{
    $directory = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'bred-contact-rate';
    if (!is_dir($directory) && !@mkdir($directory, 0700, true) && !is_dir($directory)) return;
    cleanup_rate_files($directory);
    $path = $directory . DIRECTORY_SEPARATOR . client_rate_key() . '.json';
    $handle = @fopen($path, 'c+');
    if ($handle === false || !flock($handle, LOCK_EX)) {
        if (is_resource($handle)) fclose($handle);
        return;
    }

    $now = time();
    $raw = stream_get_contents($handle);
    $entries = is_string($raw) ? json_decode($raw, true) : [];
    if (!is_array($entries)) $entries = [];
    $entries = array_values(array_filter($entries, static function ($time) use ($now): bool {
        return is_int($time) && $time > $now - RATE_WINDOW_SECONDS;
    }));
    if (count($entries) >= RATE_MAX_REQUESTS) {
        flock($handle, LOCK_UN);
        fclose($handle);
        respond(429, false, 'rate_limited', 'Trop de tentatives ont été effectuées. Réessayez dans quelques minutes.');
    }
    $entries[] = $now;
    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode($entries));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
}

function valid_docx_container(string $temporaryPath): bool
{
    if (!class_exists('ZipArchive')) return false;
    $zip = new ZipArchive();
    if ($zip->open($temporaryPath) !== true) return false;
    $valid = $zip->locateName('[Content_Types].xml') !== false
        && $zip->locateName('word/document.xml') !== false;
    $zip->close();
    return $valid;
}

function load_contact_config(): array
{
    $configuredPath = getenv('BRED_CONTACT_CONFIG');
    $documentRoot = $_SERVER['DOCUMENT_ROOT'] ?? '';
    $ovhPrivatePath = is_string($documentRoot) && $documentRoot !== ''
        ? dirname(rtrim($documentRoot, '/\\')) . DIRECTORY_SEPARATOR . 'bred-config' . DIRECTORY_SEPARATOR . 'contact.php'
        : '';
    $localPath = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'contact.local.php';

    if (is_string($configuredPath) && $configuredPath !== '') {
        $path = $configuredPath;
    } elseif ($ovhPrivatePath !== '' && is_file($ovhPrivatePath)) {
        // On OVH: /home/account/bred-config/contact.php, outside /home/account/www.
        $path = $ovhPrivatePath;
    } else {
        $path = $localPath;
    }
    if (!is_file($path) || !is_readable($path)) throw new RuntimeException('contact_config_missing');
    $config = require $path;
    if (!is_array($config)) throw new RuntimeException('contact_config_invalid');

    $required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_USERNAME', 'SMTP_PASSWORD', 'SMTP_FROM_EMAIL', 'SMTP_FROM_NAME'];
    foreach ($required as $key) {
        if (!array_key_exists($key, $config) || $config[$key] === '') throw new RuntimeException('contact_config_incomplete');
    }
    $port = filter_var($config['SMTP_PORT'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 65535]]);
    if ($port === false || !in_array($config['SMTP_SECURE'], ['tls', 'ssl'], true)) throw new RuntimeException('contact_config_transport_invalid');
    if (!filter_var($config['SMTP_FROM_EMAIL'], FILTER_VALIDATE_EMAIL)) throw new RuntimeException('contact_config_sender_invalid');
    $config['SMTP_PORT'] = $port;
    return $config;
}

function safe_log(array $config, string $requestId, string $result, string $internalCode, string $recipientId, array $signals = []): void
{
    $entry = json_encode([
        'date' => gmdate('c'),
        'request_id' => $requestId,
        'result' => $result,
        'internal_code' => $internalCode,
        'recipient' => $recipientId,
        'signals' => array_values($signals),
    ], JSON_UNESCAPED_SLASHES);
    if (!is_string($entry)) return;
    $logPath = $config['LOG_PATH'] ?? '';
    if (is_string($logPath) && $logPath !== '') {
        if (@error_log($entry . PHP_EOL, 3, $logPath)) return;
    }
    error_log('[BRED contact] ' . $entry);
}

function html_value(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, false, 'method_not_allowed', 'Cette ressource accepte uniquement les requêtes POST.');
}
$contentType = strtolower((string) ($_SERVER['CONTENT_TYPE'] ?? ''));
if (strpos($contentType, 'multipart/form-data') !== 0) respond(415, false, 'unsupported_media_type', 'Le format de la requête n’est pas accepté.');
$postedLanguage = $_POST['language'] ?? 'fr';
$responseLanguage = is_string($postedLanguage) && in_array($postedLanguage, ['fr', 'en', 'nl'], true) ? $postedLanguage : 'fr';
$contentLength = filter_var($_SERVER['CONTENT_LENGTH'] ?? 0, FILTER_VALIDATE_INT);
if (is_int($contentLength) && $contentLength > MAX_REQUEST_BYTES) respond(413, false, 'request_too_large', 'La requête dépasse la taille autorisée.');

enforce_rate_limit();

// Origin and Referer remain defence-in-depth signals only.
$origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
$referer = (string) ($_SERVER['HTTP_REFERER'] ?? '');
$allowedOrigins = ['https://edubrussels.org', 'https://www.edubrussels.org'];
$originMismatch = $origin !== '' && !in_array($origin, $allowedOrigins, true);
$refererMismatch = $referer !== '' && strpos($referer, 'https://edubrussels.org/') !== 0 && strpos($referer, 'https://www.edubrussels.org/') !== 0;

// A short duration is recorded as a signal and never rejects a request alone.
$duration = filter_var($_POST['form_duration'] ?? null, FILTER_VALIDATE_INT);
$fastSubmissionSignal = is_int($duration) && $duration >= 0 && $duration < 1500;
$honeypot = $_POST['website'] ?? '';
if (!is_string($honeypot) || trim($honeypot) !== '') respond(422, false, 'submission_rejected', 'La demande n’a pas pu être traitée.');

$recipientMap = [
    'general' => 'info@edubrussels.org',
    'kadir' => 'kadir.demir@edubrussels.org',
    'selim' => 'selim.ardag@edubrussels.org',
    'mehmet' => 'mehmet.namni@edubrussels.org',
];

$errors = [];
$firstName = text_field('first_name', 80, true, $errors);
$lastName = text_field('last_name', 80, true, $errors);
$email = text_field('email', 254, true, $errors);
$phone = text_field('phone', 40, false, $errors);
$organization = text_field('organization', 160, false, $errors);
$subject = text_field('subject', 160, true, $errors);
$message = text_field('message', 6000, true, $errors);
$recipientId = text_field('recipient', 20, true, $errors);
$consent = $_POST['consent'] ?? null;

if ($email !== '' && (!filter_var($email, FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/', $email))) $errors['email'] = 'Adresse e-mail invalide.';
if (preg_match('/[\r\n]/', $subject)) $errors['subject'] = 'Sujet invalide.';
if (!array_key_exists($recipientId, $recipientMap)) $errors['recipient'] = 'Destinataire invalide.';
if ($consent !== '1') $errors['consent'] = 'Votre accord est nécessaire.';

$attachment = null;
if (isset($_FILES['attachment']) && is_array($_FILES['attachment'])) {
    $upload = $_FILES['attachment'];
    foreach (['name', 'type', 'tmp_name', 'error', 'size'] as $key) {
        if (!array_key_exists($key, $upload) || is_array($upload[$key])) {
            $errors['attachment'] = 'Pièce jointe invalide.';
            break;
        }
    }
    if (!isset($errors['attachment']) && (int) $upload['error'] !== UPLOAD_ERR_NO_FILE) {
        if (in_array((int) $upload['error'], [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true)) $errors['attachment'] = 'Le fichier dépasse la limite de 5 Mo.';
        elseif ((int) $upload['error'] !== UPLOAD_ERR_OK || !is_uploaded_file((string) $upload['tmp_name'])) $errors['attachment'] = 'Le transfert du fichier a échoué.';
        elseif ((int) $upload['size'] <= 0) $errors['attachment'] = 'Le fichier est vide.';
        elseif ((int) $upload['size'] > MAX_ATTACHMENT_BYTES) $errors['attachment'] = 'Le fichier dépasse la limite de 5 Mo.';
        else {
            $originalName = basename((string) $upload['name']);
            $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
            $allowedMimeByExtension = [
                'pdf' => ['application/pdf'],
                'doc' => ['application/msword', 'application/CDFV2', 'application/x-ole-storage'],
                'docx' => ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip'],
                'jpg' => ['image/jpeg'],
                'jpeg' => ['image/jpeg'],
                'png' => ['image/png'],
            ];
            if (!class_exists('finfo')) respond(500, false, 'server_error', 'Le contrôle de la pièce jointe est temporairement indisponible.');
            $finfo = new finfo(FILEINFO_MIME_TYPE);
            $mime = $finfo->file((string) $upload['tmp_name']);
            $extensionAllowed = isset($allowedMimeByExtension[$extension]);
            $mimeAllowed = is_string($mime) && $extensionAllowed && in_array($mime, $allowedMimeByExtension[$extension], true);
            $docxValid = $extension !== 'docx' || ($mimeAllowed && valid_docx_container((string) $upload['tmp_name']));
            if (!$extensionAllowed || !$mimeAllowed || !$docxValid) $errors['attachment'] = 'Le type réel du fichier n’est pas autorisé.';
            else {
                $safeDisplayName = preg_replace('/[^\pL\pN._ -]+/u', '_', $originalName) ?: ('piece-jointe.' . $extension);
                $attachment = ['temporary_path' => (string) $upload['tmp_name'], 'display_name' => $safeDisplayName, 'mime' => $mime];
            }
        }
    }
}
if ($errors !== []) respond(422, false, 'validation_error', 'Vérifiez les informations saisies.', $errors);

$signals = [];
if ($originMismatch) $signals[] = 'origin_mismatch';
if ($refererMismatch) $signals[] = 'referer_mismatch';
if ($fastSubmissionSignal) $signals[] = 'fast_submission';

try {
    $config = load_contact_config();
    require_once dirname(__DIR__) . '/vendor/phpmailer/src/Exception.php';
    require_once dirname(__DIR__) . '/vendor/phpmailer/src/PHPMailer.php';
    require_once dirname(__DIR__) . '/vendor/phpmailer/src/SMTP.php';

    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = (string) $config['SMTP_HOST'];
    $mail->Port = (int) $config['SMTP_PORT'];
    $mail->SMTPAuth = true;
    $mail->Username = (string) $config['SMTP_USERNAME'];
    $mail->Password = (string) $config['SMTP_PASSWORD'];
    $mail->SMTPSecure = $config['SMTP_SECURE'] === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Timeout = 15;
    $mail->CharSet = PHPMailer::CHARSET_UTF8;
    $mail->Encoding = PHPMailer::ENCODING_BASE64;
    $mail->setFrom((string) $config['SMTP_FROM_EMAIL'], (string) $config['SMTP_FROM_NAME']);
    $mail->addAddress($recipientMap[$recipientId]);
    $mail->addReplyTo($email, trim($firstName . ' ' . $lastName));
    $mail->Subject = '[BRED] ' . $subject;

    $mailCopy = [
        'fr' => ['title' => 'Nouveau message depuis edubrussels.org', 'first' => 'Prénom', 'last' => 'Nom', 'phone' => 'Téléphone', 'organisation' => 'Organisation', 'recipient' => 'Destinataire', 'subject' => 'Sujet', 'message' => 'Message', 'missing_m' => 'Non renseigné', 'missing_f' => 'Non renseignée'],
        'en' => ['title' => 'New message from edubrussels.org', 'first' => 'First name', 'last' => 'Last name', 'phone' => 'Phone', 'organisation' => 'Organisation', 'recipient' => 'Recipient', 'subject' => 'Subject', 'message' => 'Message', 'missing_m' => 'Not provided', 'missing_f' => 'Not provided'],
        'nl' => ['title' => 'Nieuw bericht via edubrussels.org', 'first' => 'Voornaam', 'last' => 'Achternaam', 'phone' => 'Telefoon', 'organisation' => 'Organisatie', 'recipient' => 'Ontvanger', 'subject' => 'Onderwerp', 'message' => 'Bericht', 'missing_m' => 'Niet ingevuld', 'missing_f' => 'Niet ingevuld'],
    ][$responseLanguage];
    $details = [
        $mailCopy['first'] => $firstName, $mailCopy['last'] => $lastName, 'E-mail' => $email,
        $mailCopy['phone'] => $phone !== '' ? $phone : $mailCopy['missing_m'],
        $mailCopy['organisation'] => $organization !== '' ? $organization : $mailCopy['missing_f'],
        $mailCopy['recipient'] => $recipientId, $mailCopy['subject'] => $subject,
    ];
    $htmlRows = '';
    $textRows = '';
    foreach ($details as $label => $value) {
        $htmlRows .= '<p><strong>' . html_value($label) . ' :</strong> ' . html_value($value) . '</p>';
        $textRows .= $label . ' : ' . $value . PHP_EOL;
    }
    $mail->isHTML(true);
    $mail->Body = '<h1>' . html_value($mailCopy['title']) . '</h1>' . $htmlRows . '<h2>' . html_value($mailCopy['message']) . '</h2><p>' . nl2br(html_value($message)) . '</p>';
    $mail->AltBody = $mailCopy['title'] . "\n\n" . $textRows . "\n" . $mailCopy['message'] . " :\n" . $message;
    if (is_array($attachment)) $mail->addAttachment($attachment['temporary_path'], $attachment['display_name'], PHPMailer::ENCODING_BASE64, $attachment['mime']);

    $mail->send();
    safe_log($config, $requestId, 'success', 'message_sent', $recipientId, $signals);
    respond(200, true, 'message_sent', 'Votre message a bien été envoyé.');
} catch (MailerException $exception) {
    $safeConfig = isset($config) && is_array($config) ? $config : [];
    safe_log($safeConfig, $requestId, 'error', 'smtp_delivery_failed', $recipientId, $signals);
    respond(500, false, 'delivery_failed', 'Le message n’a pas pu être envoyé. Vos informations sont conservées afin que vous puissiez réessayer.');
} catch (Throwable $exception) {
    $safeConfig = isset($config) && is_array($config) ? $config : [];
    safe_log($safeConfig, $requestId, 'error', 'server_failure_' . get_class($exception), $recipientId, $signals);
    respond(500, false, 'delivery_failed', 'Le message n’a pas pu être envoyé. Vos informations sont conservées afin que vous puissiez réessayer.');
}
