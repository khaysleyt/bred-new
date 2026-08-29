(() => {
    "use strict";

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !window.gsap || !window.ScrollTrigger) return;

    const { gsap } = window;
    gsap.registerPlugin(window.ScrollTrigger);

    const compact = window.matchMedia("(max-width: 820px)").matches;
    const hero = gsap.timeline({ defaults: { ease: "power3.out" } });
    hero
        .from("[data-about-hero-copy]", { y: compact ? 8 : 14, opacity: 0, duration: .55, stagger: .08 })
        .from("[data-about-title]", { yPercent: 108, duration: compact ? .68 : .9, stagger: .08 }, "-=.35")
        .from("[data-about-hero-axes] span", { x: compact ? 0 : 12, y: compact ? 8 : 0, opacity: 0, duration: .5, stagger: .07 }, "-=.5");

    gsap.utils.toArray("[data-about-reveal]").forEach((element) => {
        gsap.from(element, { y: compact ? 14 : 22, opacity: 0, duration: compact ? .58 : .72, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 84%", once: true } });
    });

    gsap.from("[data-about-pillar]", { y: 18, opacity: 0, duration: .62, stagger: .08, ease: "power3.out", scrollTrigger: { trigger: ".about-pillar-list", start: "top 80%", once: true } });
    gsap.from("[data-about-verb]", { x: compact ? 8 : 24, opacity: 0, duration: .65, stagger: .09, ease: "power3.out", scrollTrigger: { trigger: ".about-verbs", start: "top 80%", once: true } });
    gsap.from("[data-about-portraits] figure", { y: compact ? 10 : 18, opacity: 0, duration: .72, stagger: .09, ease: "power3.out", scrollTrigger: { trigger: "[data-about-portraits]", start: "top 82%", once: true } });
    gsap.from("[data-about-project-image]", { clipPath: "inset(0 0 10% 0)", y: 14, opacity: 0, duration: .8, ease: "power3.out", scrollTrigger: { trigger: "[data-about-project-image]", start: "top 84%", once: true } });
})();
