<?php
declare(strict_types=1);

/*
 * Copy this file to /home/OVH_ACCOUNT/bred-config/contact.php, outside /www.
 * The backend discovers that location from DOCUMENT_ROOT. BRED_CONTACT_CONFIG
 * may instead contain an explicit absolute path when environment variables are
 * available.
 * For local development only, config/contact.local.php is also supported.
 */
return [
    'SMTP_HOST' => 'ssl0.ovh.net',
    'SMTP_PORT' => 465,
    'SMTP_SECURE' => 'ssl', // implicit SSL/TLS
    'SMTP_USERNAME' => 'info@edubrussels.org',
    'SMTP_PASSWORD' => 'PASSWORD_PLACEHOLDER',
    'SMTP_FROM_EMAIL' => 'info@edubrussels.org',
    'SMTP_FROM_NAME' => 'BRED — Brussels Education & Development',
    // Optional absolute path outside the public web root.
    'LOG_PATH' => '',
];
