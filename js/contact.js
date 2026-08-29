(() => {
    "use strict";

    const form = document.querySelector("[data-contact-form]");
    if (!form) return;

    const startedAt = performance.now();
    const recipientSelect = form.querySelector("[data-recipient-select]");
    const cards = document.querySelectorAll("[data-contact-card], [data-contact-card-mobile]");
    const fileInput = form.querySelector("[data-upload-input]");
    const uploadZone = form.querySelector("[data-upload-zone]");
    const uploadFile = form.querySelector("[data-upload-file]");
    const removeFileButton = form.querySelector("[data-file-remove]");
    const message = form.querySelector("#message");
    const messageCount = form.querySelector("[data-message-count]");
    const submitButton = form.querySelector("[data-submit-button]");
    const submitLabel = form.querySelector("[data-submit-label]");
    const formStatus = form.querySelector("[data-form-status]");
    const durationInput = form.querySelector("[data-form-duration]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const maximumFileSize = 5 * 1024 * 1024;
    const allowedExtensions = new Set(["pdf", "doc", "docx", "jpg", "jpeg", "png"]);
    const contactScript = document.querySelector('script[src$="/contact.js"], script[src="../js/contact.js"]');
    const assetUrl = (path) => new URL(`../assets/${path}`, contactScript?.src || window.location.href).href;
    const locale = ["fr", "en", "nl"].includes(document.documentElement.lang) ? document.documentElement.lang : "fr";
    const localeTag = { fr: "fr-BE", en: "en-GB", nl: "nl-BE" }[locale];
    const copy = {
        fr: { contact: "Votre interlocuteur", portrait: "Portrait de", empty: "Le fichier sélectionné est vide.", large: "Le fichier dépasse la limite de 5 Mo.", type: "Choisissez un fichier PDF, DOC, DOCX, JPG ou PNG.", consent: "Votre accord est nécessaire pour envoyer le message.", required: "Ce champ est obligatoire.", email: "Saisissez une adresse e-mail valide.", limit: "Ce champ est limité à {count} caractères.", invalid: "Vérifiez la valeur saisie.", sending: "Envoi en cours…", send: "Envoyer le message", oneFile: "Une seule pièce jointe est autorisée.", check: "Vérifiez les champs signalés avant l’envoi.", unavailable: "L’envoi n’est pas encore disponible. Réessayez ultérieurement.", success: "Votre message a bien été envoyé.", failed: "L’envoi a échoué. Vos informations sont conservées pour vous permettre de réessayer." },
        en: { contact: "Your contact", portrait: "Portrait of", empty: "The selected file is empty.", large: "The file exceeds the 5 MB limit.", type: "Choose a PDF, DOC, DOCX, JPG or PNG file.", consent: "Your consent is required to send the message.", required: "This field is required.", email: "Enter a valid email address.", limit: "This field is limited to {count} characters.", invalid: "Check the value entered.", sending: "Sending…", send: "Send message", oneFile: "Only one attachment is allowed.", check: "Check the highlighted fields before sending.", unavailable: "Sending is not currently available. Please try again later.", success: "Your message has been sent.", failed: "The message could not be sent. Your information has been retained so you can try again." },
        nl: { contact: "Je contactpersoon", portrait: "Portret van", empty: "Het geselecteerde bestand is leeg.", large: "Het bestand is groter dan 5 MB.", type: "Kies een PDF-, DOC-, DOCX-, JPG- of PNG-bestand.", consent: "Je toestemming is vereist om het bericht te verzenden.", required: "Dit veld is verplicht.", email: "Vul een geldig e-mailadres in.", limit: "Dit veld is beperkt tot {count} tekens.", invalid: "Controleer de ingevulde waarde.", sending: "Bezig met verzenden…", send: "Bericht verzenden", oneFile: "Er is slechts één bijlage toegestaan.", check: "Controleer de gemarkeerde velden voordat je verzendt.", unavailable: "Verzenden is momenteel niet beschikbaar. Probeer het later opnieuw.", success: "Je bericht is verzonden.", failed: "Het bericht kon niet worden verzonden. Je gegevens zijn bewaard zodat je het opnieuw kunt proberen." }
    }[locale];

    const recipients = {
        general: {
            name: "BRED",
            role: "Brussels Education & Development",
            description: { fr: "Pour une question générale concernant les activités de BRED.", en: "For a general question about BRED’s activities.", nl: "Voor een algemene vraag over de activiteiten van BRED." }[locale],
            logo: assetUrl("images/branding/logo-bred-icon.png")
        },
        kadir: {
            name: "Kadir Demir",
            role: { fr: "Directeur", en: "Director", nl: "Directeur" }[locale],
            description: { fr: "Engagé dans l’éducation, la formation et la coopération internationale.", en: "Committed to education, training and international cooperation.", nl: "Geëngageerd in onderwijs, opleiding en internationale samenwerking." }[locale],
            image: assetUrl("images/team/optimized/kadir-demir-480.webp")
        },
        selim: {
            name: "Selim Ardağ",
            role: "Directeur D&I & Community",
            description: { fr: "Il coordonne des programmes de diversité et d’inclusion à Bruxelles.", en: "He coordinates diversity and inclusion programmes in Brussels.", nl: "Hij coördineert programma’s rond diversiteit en inclusie in Brussel." }[locale],
            image: assetUrl("images/team/optimized/selim-ardag-480.webp")
        },
        mehmet: {
            name: "Mehmet Namni",
            role: { fr: "Directeur EU Projects", en: "Director, EU Projects", nl: "Directeur EU-projecten" }[locale],
            description: { fr: "Il contribue à la coordination de projets européens axés sur l’éducation, l’inclusion sociale et la jeunesse.", en: "He helps coordinate European projects focused on education, social inclusion and youth.", nl: "Hij draagt bij aan de coördinatie van Europese projecten rond onderwijs, sociale inclusie en jongeren." }[locale],
            image: assetUrl("images/team/optimized/mehmet-namni-480.webp")
        }
    };

    const createContactCard = (recipient, recipientId) => {
        const fragment = document.createDocumentFragment();
        const media = document.createElement("div");
        media.className = recipient.image
            ? `contact-card-media contact-card-media-${recipientId}`
            : "contact-card-media contact-card-logo";
        const image = document.createElement("img");
        image.src = recipient.image || recipient.logo;
        image.width = 480;
        image.height = 480;
        image.alt = recipient.image ? `${copy.portrait} ${recipient.name}` : "";
        image.loading = "lazy";
        image.decoding = "async";
        media.append(image);

        const body = document.createElement("div");
        body.className = "contact-card-body";
        const label = document.createElement("p");
        label.className = "contact-card-label";
        label.textContent = copy.contact;
        const name = document.createElement("h3");
        name.textContent = recipient.name;
        const role = document.createElement("p");
        role.className = "contact-card-role";
        role.textContent = recipient.role;
        const description = document.createElement("p");
        description.className = "contact-card-description";
        description.textContent = recipient.description;
        body.append(label, name, role, description);
        fragment.append(media, body);
        return fragment;
    };

    const renderRecipient = (animate = true) => {
        const recipientId = Object.hasOwn(recipients, recipientSelect.value) ? recipientSelect.value : "general";
        const recipient = recipients[recipientId];
        cards.forEach((card) => {
            const replace = () => {
                card.dataset.recipient = recipientId;
                card.replaceChildren(createContactCard(recipient, recipientId));
                if (animate && !reducedMotion && window.gsap) {
                    window.gsap.from(card.children, { y: 7, opacity: 0, duration: .38, stagger: .045, ease: "power3.out" });
                }
            };
            if (animate && !reducedMotion && window.gsap && card.children.length) {
                window.gsap.to(card.children, { y: -5, opacity: 0, duration: .16, stagger: .025, ease: "power2.in", onComplete: replace });
            } else replace();
        });
    };

    const getErrorElement = (control) => form.querySelector(`[data-error-for="${control.id}"]`);
    const clearError = (control) => {
        control.removeAttribute("aria-invalid");
        const error = getErrorElement(control);
        if (error) error.textContent = "";
    };
    const setError = (control, text) => {
        control.setAttribute("aria-invalid", "true");
        const error = getErrorElement(control);
        if (error) error.textContent = text;
    };

    const validateFile = () => {
        const file = fileInput.files[0];
        clearError(fileInput);
        if (!file) return true;
        const extension = file.name.includes(".") ? file.name.split(".").pop().toLowerCase() : "";
        if (file.size === 0) {
            setError(fileInput, copy.empty);
            return false;
        }
        if (file.size > maximumFileSize) {
            setError(fileInput, copy.large);
            return false;
        }
        if (!allowedExtensions.has(extension)) {
            setError(fileInput, copy.type);
            return false;
        }
        return true;
    };

    const showSelectedFile = () => {
        const file = fileInput.files[0];
        if (!file || !validateFile()) {
            uploadFile.hidden = true;
            uploadZone.hidden = false;
            return;
        }
        uploadFile.querySelector("[data-file-name]").textContent = file.name;
        uploadFile.querySelector("[data-file-size]").textContent = `${(file.size / 1024 / 1024).toLocaleString(localeTag, { maximumFractionDigits: 2 })} ${locale === "fr" ? "Mo" : "MB"}`;
        uploadFile.querySelector(".upload-file-icon").textContent = file.name.split(".").pop().toUpperCase();
        uploadZone.hidden = true;
        uploadFile.hidden = false;
    };

    const clearFile = (restoreFocus = true) => {
        fileInput.value = "";
        uploadFile.hidden = true;
        uploadZone.hidden = false;
        clearError(fileInput);
        if (restoreFocus) fileInput.focus();
    };

    const validationMessage = (control) => {
        if (control.validity.valueMissing) return control.type === "checkbox" ? copy.consent : copy.required;
        if (control.validity.typeMismatch) return copy.email;
        if (control.validity.tooLong) return copy.limit.replace("{count}", control.maxLength.toLocaleString(localeTag));
        return copy.invalid;
    };

    const validateControl = (control) => {
        clearError(control);
        if (!control.checkValidity()) {
            setError(control, validationMessage(control));
            return false;
        }
        return true;
    };

    const validateForm = () => {
        const controls = [...form.querySelectorAll("input:not([type='hidden']):not([name='website']), select, textarea")];
        let firstInvalid = null;
        controls.forEach((control) => {
            const valid = control === fileInput ? validateFile() : validateControl(control);
            if (!valid && !firstInvalid) firstInvalid = control;
        });
        firstInvalid?.focus();
        return !firstInvalid;
    };

    const setSubmitting = (submitting) => {
        submitButton.disabled = submitting;
        submitButton.classList.toggle("is-loading", submitting);
        submitLabel.textContent = submitting ? copy.sending : copy.send;
        form.setAttribute("aria-busy", String(submitting));
    };

    recipientSelect.addEventListener("change", () => renderRecipient(true));
    message.addEventListener("input", () => { messageCount.textContent = `${message.value.length.toLocaleString(localeTag)} / ${Number(6000).toLocaleString(localeTag)}`; });
    fileInput.addEventListener("change", showSelectedFile);
    removeFileButton.addEventListener("click", clearFile);

    ["dragenter", "dragover"].forEach((type) => uploadZone.addEventListener(type, (event) => { event.preventDefault(); uploadZone.classList.add("is-dragging"); }));
    ["dragleave", "drop"].forEach((type) => uploadZone.addEventListener(type, (event) => { event.preventDefault(); uploadZone.classList.remove("is-dragging"); }));
    uploadZone.addEventListener("drop", (event) => {
        const files = event.dataTransfer?.files;
        if (!files?.length) return;
        if (files.length > 1) {
            setError(fileInput, copy.oneFile);
            return;
        }
        const transfer = new DataTransfer();
        transfer.items.add(files[0]);
        fileInput.files = transfer.files;
        showSelectedFile();
    });

    form.addEventListener("input", (event) => {
        const control = event.target;
        if (control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement || control instanceof HTMLSelectElement) clearError(control);
    });
    form.addEventListener("focusout", (event) => {
        const control = event.target;
        if ((control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement || control instanceof HTMLSelectElement) && control.name !== "website" && control.value) validateControl(control);
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        formStatus.textContent = "";
        formStatus.className = "form-status";
        if (!validateForm()) {
            formStatus.textContent = copy.check;
            formStatus.classList.add("is-error");
            return;
        }
        durationInput.value = String(Math.round(performance.now() - startedAt));
        setSubmitting(true);
        try {
            const response = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
            const result = await response.json().catch(() => ({}));
            if (!response.ok || result.success !== true) {
                const fieldIds = { first_name: "first-name", last_name: "last-name", email: "email", phone: "phone", organization: "organization", recipient: "recipient", subject: "subject", message: "message", attachment: "attachment", consent: "consent" };
                if (result.errors && typeof result.errors === "object") {
                    Object.entries(result.errors).forEach(([name, errorMessage]) => {
                        const control = document.getElementById(fieldIds[name]);
                        if (control && typeof errorMessage === "string") setError(control, errorMessage);
                    });
                }
                throw new Error(result.message || copy.unavailable);
            }
            form.reset();
            clearFile(false);
            messageCount.textContent = "0 / 6 000";
            renderRecipient(false);
            formStatus.textContent = copy.success;
            formStatus.classList.add("is-success");
        } catch (error) {
            formStatus.textContent = error instanceof Error ? error.message : copy.failed;
            formStatus.classList.add("is-error");
        } finally {
            setSubmitting(false);
        }
    });

    renderRecipient(false);

    if (!reducedMotion && window.gsap) {
        const { gsap } = window;
        const path = document.querySelector("[data-contact-trajectory]");
        if (path) {
            const length = path.getTotalLength();
            gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
            gsap.to(path, { strokeDashoffset: 0, duration: 1.45, ease: "power2.out", delay: .18 });
        }
        gsap.from("[data-contact-intro]", { y: 14, opacity: 0, duration: .62, stagger: .075, ease: "power3.out" });
        document.querySelectorAll("[data-contact-reveal]").forEach((element, index) => gsap.from(element, { y: 18, opacity: 0, duration: .72, delay: index * .08, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 88%", once: true } }));
    }
})();
