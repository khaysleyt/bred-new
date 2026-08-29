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
        return length;
    };

    const heroPath = document.querySelector("[data-projects-hero-path]");
    const heroEnd = document.querySelector("[data-projects-route-end]");
    preparePath(heroPath);
    if (heroEnd) gsap.set(heroEnd, { opacity: 0 });

    const hero = gsap.timeline({ defaults: { ease: "power3.out" } });
    hero
        .from("[data-projects-intro]", { y: 22, opacity: 0, duration: .72, stagger: .075 })
        .to(heroPath, { strokeDashoffset: 0, duration: 1.45, ease: "power2.out" }, .16)
        .from(".projects-route-medallion", { scale: .88, opacity: 0, duration: .48, stagger: .09 }, .42)
        .from(".projects-route-point b", { x: -4, opacity: 0, duration: .42, stagger: .09 }, .48)
        .to(heroEnd, { opacity: 1, duration: .16, ease: "power2.out" }, 1.6);

    gsap.utils.toArray("[data-projects-reveal]").forEach((element) => {
        gsap.from(element, { y: 24, duration: .76, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 86%", once: true } });
    });

    gsap.from("[data-projects-image] picture", {
        clipPath: "inset(0 0 8% 0)",
        duration: 1.05,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-projects-image]", start: "top 82%", once: true }
    });

    gsap.from("[data-projects-axis]", {
        y: 24,
        duration: .68,
        stagger: .09,
        ease: "power3.out",
        scrollTrigger: { trigger: ".projects-axes-list", start: "top 82%", once: true }
    });

    const axesProgress = document.querySelector("[data-projects-axes-progress]");
    const axesCursor = document.querySelector("[data-projects-axes-cursor]");
    if (axesProgress && axesCursor) {
        gsap.set(axesProgress, { scaleX: 0 });
        gsap.set(axesCursor, { x: 0 });
        const axesTimeline = gsap.timeline({ scrollTrigger: { trigger: ".projects-axes", start: "top 62%", once: true } });
        axesTimeline
            .to(axesProgress, { scaleX: 1, duration: 1.15, ease: "power2.inOut" })
            .to(axesCursor, { x: () => axesCursor.parentElement.clientWidth - axesCursor.offsetWidth, duration: 1.15, ease: "power2.inOut" }, 0)
            .from(".projects-axis-sign > i", { rotate: -12, scale: .84, duration: .48, stagger: .1, ease: "power3.out" }, .2);
    }

    const cooperationPath = document.querySelector("[data-projects-cooperation-path]");
    preparePath(cooperationPath);
    gsap.to(cooperationPath, { strokeDashoffset: 0, duration: 1.6, ease: "power2.out", scrollTrigger: { trigger: ".projects-cooperation", start: "top 75%", once: true } });
})();
