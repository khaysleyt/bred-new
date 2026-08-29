(() => {
    "use strict";

    document.documentElement.classList.replace("no-js", "js");

    const header = document.querySelector("[data-header]");
    const menuToggle = document.querySelector("[data-menu-toggle]");
    const navigation = document.querySelector("[data-navigation]");
    const navLinks = [...document.querySelectorAll(".nav-link")];
    const year = document.querySelector("[data-current-year]");
    const mobileQuery = window.matchMedia("(max-width: 820px)");
    let lastFocusedElement = null;
    let headerFrame = 0;

    if (year) year.textContent = String(new Date().getFullYear());

    const updateHeader = () => {
        headerFrame = 0;
        header?.classList.toggle("is-scrolled", window.scrollY > 20);
    };

    window.addEventListener("scroll", () => {
        if (!headerFrame) headerFrame = window.requestAnimationFrame(updateHeader);
    }, { passive: true });
    updateHeader();

    const closeMenu = (restoreFocus = false) => {
        if (!menuToggle || !navigation) return;
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", menuToggle.dataset.openLabel || "Ouvrir le menu");
        navigation.classList.remove("is-open");
        document.body.classList.remove("menu-open");
        if (restoreFocus && lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
    };

    const openMenu = () => {
        if (!menuToggle || !navigation) return;
        lastFocusedElement = document.activeElement;
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", menuToggle.dataset.closeLabel || "Fermer le menu");
        navigation.classList.add("is-open");
        document.body.classList.add("menu-open");
        navigation.querySelector("a")?.focus();
    };

    menuToggle?.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        if (isOpen) closeMenu(true); else openMenu();
    });

    navigation?.addEventListener("click", (event) => {
        if (event.target.closest("a") && mobileQuery.matches) closeMenu(false);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
            closeMenu(true);
            return;
        }
        if (event.key !== "Tab" || menuToggle?.getAttribute("aria-expanded") !== "true" || !navigation) return;
        const focusable = [menuToggle, ...navigation.querySelectorAll("a")];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault(); first.focus();
        }
    });

    mobileQuery.addEventListener("change", (event) => {
        if (!event.matches) closeMenu(false);
    });

    const observedSections = navLinks
        .filter((link) => link.getAttribute("href")?.startsWith("#"))
        .map((link) => ({ link, section: document.querySelector(link.getAttribute("href")) }))
        .filter((item) => item.section);

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (!visible) return;
            navLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`));
        }, { rootMargin: "-28% 0px -58%", threshold: [0, .25, .6] });
        observedSections.forEach(({ section }) => sectionObserver.observe(section));
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !window.gsap || !window.ScrollTrigger) return;

    const { gsap } = window;
    gsap.registerPlugin(window.ScrollTrigger);
    const motion = gsap.matchMedia();

    document.querySelectorAll("[data-trajectory]").forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    });

    motion.add({ desktop: "(min-width: 821px)", mobile: "(max-width: 820px)" }, (context) => {
        const isMobile = context.conditions.mobile;
        if (!document.querySelector(".hero")) return undefined;
        const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

        heroTimeline
            .from("[data-hero-kicker]", { y: isMobile ? 6 : 10, opacity: 0, duration: .42 })
            .from(".title-line", { yPercent: 102, duration: isMobile ? .58 : .72, stagger: isMobile ? .045 : .065 }, "-=.22")
            .from("[data-hero-lead]", { y: isMobile ? 7 : 12, opacity: 0, duration: .5 }, "-=.34")
            .from("[data-hero-actions] > *", { y: 7, opacity: 0, duration: .42, stagger: .06 }, "-=.3")
            .from("[data-portrait]", { y: isMobile ? 10 : 18, scale: isMobile ? .988 : .975, opacity: 0, duration: isMobile ? .54 : .72, stagger: .055 }, "-=.58")
            .to(".hero [data-trajectory]", { strokeDashoffset: 0, duration: isMobile ? .7 : 1.45, stagger: .08, ease: "power2.out" }, "-=.58")
            .from("[data-pillar]", { y: isMobile ? 7 : 11, opacity: 0, duration: .48, stagger: .06 }, "-=.32");

        if (!isMobile && window.matchMedia("(pointer: fine)").matches) {
            const visual = document.querySelector("[data-hero-visual]");
            const portraits = gsap.utils.toArray("[data-portrait]");
            const moveX = portraits.map((portrait, index) => gsap.quickTo(portrait, "x", { duration: .65, ease: "power3.out" }));
            const moveY = portraits.map((portrait, index) => gsap.quickTo(portrait, "y", { duration: .65, ease: "power3.out" }));
            const pointerMove = (event) => {
                const bounds = visual.getBoundingClientRect();
                const x = (event.clientX - bounds.left) / bounds.width - .5;
                const y = (event.clientY - bounds.top) / bounds.height - .5;
                portraits.forEach((portrait, index) => {
                    const depth = 3 + index * 1.1;
                    moveX[index](x * depth); moveY[index](y * depth);
                });
            };
            const pointerLeave = () => portraits.forEach((portrait, index) => { moveX[index](0); moveY[index](0); });
            visual?.addEventListener("pointermove", pointerMove, { passive: true });
            visual?.addEventListener("pointerleave", pointerLeave);
            return () => {
                visual?.removeEventListener("pointermove", pointerMove);
                visual?.removeEventListener("pointerleave", pointerLeave);
            };
        }
        return undefined;
    });

    gsap.utils.toArray("[data-reveal='heading']").forEach((element) => {
        gsap.from(element, { y: 26, duration: .8, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 84%", once: true } });
    });
    gsap.utils.toArray("[data-reveal='copy']").forEach((element) => {
        gsap.from(element, { y: 20, duration: .75, delay: .08, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 86%", once: true } });
    });
    if (document.querySelector("[data-line-reveal]")) gsap.from("[data-line-reveal]", { scaleX: 0, duration: 1.15, ease: "expo.out", scrollTrigger: { trigger: "[data-line-reveal]", start: "top 90%", once: true } });
    if (document.querySelector("[data-action]")) gsap.from("[data-action]", { y: 28, duration: .75, stagger: .1, ease: "power3.out", scrollTrigger: { trigger: ".action-composition", start: "top 78%", once: true } });
    if (document.querySelector("[data-team-member]")) gsap.from("[data-team-member]", { y: 26, duration: .7, stagger: .08, ease: "power3.out", scrollTrigger: { trigger: ".team-grid", start: "top 82%", once: true } });

    const contactPath = document.querySelector(".contact-trajectory [data-trajectory]");
    if (contactPath) gsap.to(contactPath, { strokeDashoffset: 0, duration: 1.6, ease: "power2.out", scrollTrigger: { trigger: ".contact-cta", start: "top 78%", once: true } });
})();
