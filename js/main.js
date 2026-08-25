(() => {
    "use strict";

    document.documentElement.classList.replace("no-js", "js");

    const header = document.querySelector("[data-header]");
    const menuToggle = document.querySelector("[data-menu-toggle]");
    const menuForm = document.querySelector("[data-menu-form]");
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
        menuToggle.setAttribute("aria-label", "Ouvrir le menu");
        navigation.classList.remove("is-open");
        document.body.classList.remove("menu-open");
        if (restoreFocus && lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
    };

    const openMenu = () => {
        if (!menuToggle || !navigation) return;
        lastFocusedElement = document.activeElement;
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Fermer le menu");
        navigation.classList.add("is-open");
        document.body.classList.add("menu-open");
        navigation.querySelector("a")?.focus();
    };

    menuForm?.addEventListener("submit", (event) => {
        event.preventDefault();
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
        const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

        heroTimeline
            .from("[data-hero-kicker]", { y: isMobile ? 10 : 16, opacity: 0, duration: .5 })
            .from(".title-line", { yPercent: 110, duration: isMobile ? .65 : .85, stagger: isMobile ? .06 : .09 }, "-=.25")
            .from("[data-hero-lead]", { y: isMobile ? 12 : 20, opacity: 0, duration: .65 }, "-=.42")
            .from("[data-hero-actions] > *", { y: 12, opacity: 0, duration: .5, stagger: .08 }, "-=.38")
            .from("[data-portrait]", { y: isMobile ? 18 : 34, scale: isMobile ? .98 : .94, opacity: 0, duration: isMobile ? .62 : .85, stagger: .08 }, "-=.68")
            .to(".hero [data-trajectory]", { strokeDashoffset: 0, duration: isMobile ? .8 : 1.25, stagger: .1, ease: "power2.out" }, "-=.65")
            .from("[data-pillar]", { y: isMobile ? 10 : 18, opacity: 0, duration: .55, stagger: .08 }, "-=.38");

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
                    const depth = 4 + index * 1.8;
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
    gsap.from("[data-line-reveal]", { scaleX: 0, duration: 1.15, ease: "expo.out", scrollTrigger: { trigger: "[data-line-reveal]", start: "top 90%", once: true } });
    gsap.from("[data-action]", { y: 28, duration: .75, stagger: .1, ease: "power3.out", scrollTrigger: { trigger: ".action-composition", start: "top 78%", once: true } });
    gsap.from("[data-team-member]", { y: 26, duration: .7, stagger: .08, ease: "power3.out", scrollTrigger: { trigger: ".team-grid", start: "top 82%", once: true } });

    const contactPath = document.querySelector(".contact-trajectory [data-trajectory]");
    if (contactPath) gsap.to(contactPath, { strokeDashoffset: 0, duration: 1.6, ease: "power2.out", scrollTrigger: { trigger: ".contact-cta", start: "top 78%", once: true } });
})();
