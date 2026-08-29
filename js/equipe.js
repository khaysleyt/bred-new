(() => {
    "use strict";

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !window.gsap || !window.ScrollTrigger) return;

    const { gsap } = window;
    gsap.registerPlugin(window.ScrollTrigger);

    const preparePath = (path) => {
        if (!path) return 0;
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        return length;
    };

    const heroPath = document.querySelector("[data-team-path]");
    preparePath(heroPath);

    const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroTimeline
        .from("[data-team-hero]", { y: 12, opacity: 0, duration: .58, stagger: .08 })
        .from("[data-team-title]", { yPercent: 105, duration: .78, stagger: .08 }, "-=.38")
        .to(heroPath, { strokeDashoffset: 0, duration: 1.35, ease: "power2.out" }, "-=.65");

    const motion = gsap.matchMedia();
    motion.add({ desktop: "(min-width: 821px)", compact: "(max-width: 820px)" }, (context) => {
        const compact = context.conditions.compact;
        gsap.from("[data-kadir-media]", {
            clipPath: "inset(0 0 100% 0)",
            duration: compact ? .72 : 1,
            ease: "power3.out",
            scrollTrigger: { trigger: ".general-director", start: "top 76%", once: true }
        });
        gsap.from("[data-kadir-copy] > *", {
            y: compact ? 12 : 20,
            opacity: 0,
            duration: compact ? .55 : .7,
            stagger: compact ? .055 : .08,
            ease: "power3.out",
            scrollTrigger: { trigger: ".general-director-copy", start: "top 82%", once: true }
        });
        gsap.from("[data-kadir-rule]", {
            scaleX: 0,
            transformOrigin: "left",
            duration: .95,
            ease: "expo.out",
            scrollTrigger: { trigger: ".general-director-copy", start: "top 82%", once: true }
        });

        if (!compact && window.matchMedia("(pointer: fine)").matches) {
            gsap.to(".general-director-media picture", {
                yPercent: -2.2,
                ease: "none",
                scrollTrigger: { trigger: ".general-director", start: "top bottom", end: "bottom top", scrub: .7 }
            });
        }
    });

    gsap.utils.toArray("[data-team-reveal]").forEach((element) => {
        gsap.from(element, { y: 22, opacity: 0, duration: .72, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 84%", once: true } });
    });

    gsap.from("[data-director]", { y: 28, opacity: 0, duration: .72, stagger: .1, ease: "power3.out", scrollTrigger: { trigger: ".directors-grid", start: "top 80%", once: true } });
    gsap.from("[data-team-lead]", { y: 24, opacity: 0, duration: .68, stagger: .075, ease: "power3.out", scrollTrigger: { trigger: ".team-leads-grid", start: "top 82%", once: true } });
    gsap.from("[data-extended-member]", { y: 16, opacity: 0, duration: .56, stagger: .055, ease: "power3.out", scrollTrigger: { trigger: ".extended-team-list", start: "top 84%", once: true } });

    document.querySelectorAll("[data-extended-path]").forEach((path) => {
        preparePath(path);
        gsap.to(path, { strokeDashoffset: 0, duration: 1.5, ease: "power2.out", scrollTrigger: { trigger: ".extended-team", start: "top 72%", once: true } });
    });
})();
