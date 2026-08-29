(() => {
    "use strict";

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !window.gsap || !window.ScrollTrigger) return;

    const { gsap } = window;
    gsap.registerPlugin(window.ScrollTrigger);

    const preparePath = (path) => {
        if (!path) return;
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    };

    const heroRoute = document.querySelector("[data-smart-hero-route]");
    const journeyPath = document.querySelector("[data-smart-journey-path]");
    const ctaRoute = document.querySelector("[data-smart-cta-route]");
    [heroRoute, journeyPath, ctaRoute].forEach(preparePath);

    const media = gsap.matchMedia();
    media.add({ desktop: "(min-width: 821px)", compact: "(max-width: 820px)" }, (context) => {
        const compact = context.conditions.compact;
        const hero = gsap.timeline({ defaults: { ease: "power3.out" } });
        hero
            .from("[data-smart-hero-copy]", { y: compact ? 7 : 12, opacity: 0, duration: compact ? .45 : .58, stagger: .07 })
            .from("[data-smart-title]", { yPercent: 108, duration: compact ? .62 : .82, stagger: .075 }, "-=.35")
            .from("[data-smart-hero-media]", { y: compact ? 12 : 20, scale: compact ? .99 : .975, opacity: 0, duration: compact ? .58 : .78, stagger: .08 }, "-=.55")
            .from("[data-smart-hero-logo]", { y: 10, scale: .96, opacity: 0, duration: .55 }, "-=.45")
            .to(heroRoute, { strokeDashoffset: 0, duration: compact ? .8 : 1.45, ease: "power2.out" }, "-=.62");

        if (!compact && window.matchMedia("(pointer: fine)").matches) {
            gsap.to(".smart-hero-photo-main picture", {
                yPercent: -2,
                ease: "none",
                scrollTrigger: { trigger: ".smart-hero", start: "top top", end: "bottom top", scrub: .7 }
            });
        }
    });

    gsap.utils.toArray("[data-smart-reveal]").forEach((element) => {
        gsap.from(element, { y: 22, opacity: 0, duration: .72, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 84%", once: true } });
    });

    gsap.from("[data-smart-pillar]", {
        y: 20,
        opacity: 0,
        duration: .65,
        stagger: .085,
        ease: "power3.out",
        scrollTrigger: { trigger: ".smart-pillars-list", start: "top 80%", once: true }
    });

    gsap.to(journeyPath, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: { trigger: "[data-smart-journey]", start: "top 78%", end: "bottom 48%", scrub: .7 }
    });
    gsap.from("[data-smart-country]", {
        y: 12,
        opacity: 0,
        duration: .55,
        stagger: .12,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-smart-journey]", start: "top 74%", once: true }
    });

    gsap.utils.toArray("[data-smart-image]").forEach((element) => {
        gsap.from(element, {
            clipPath: "inset(0 0 10% 0)",
            y: 18,
            opacity: 0,
            duration: .8,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 84%", once: true }
        });
    });

    gsap.from("[data-smart-partner]", {
        y: 10,
        opacity: 0,
        duration: .55,
        stagger: .07,
        ease: "power3.out",
        scrollTrigger: { trigger: ".smart-partners-list", start: "top 82%", once: true }
    });

    gsap.to(ctaRoute, {
        strokeDashoffset: 0,
        duration: 1.4,
        ease: "power2.out",
        scrollTrigger: { trigger: ".smart-project-cta", start: "top 78%", once: true }
    });
})();
