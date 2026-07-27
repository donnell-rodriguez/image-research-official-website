import React from "react";

export function useRevealAnimations() {
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const targets = Array.from(
      document.querySelectorAll(
        [
          ".section-heading",
          ".split-copy",
          ".product-copy",
          ".product-media",
          ".article-card",
          ".feature-item",
          ".profile-card",
          ".contact-copy",
          ".contact-map",
          ".sidebar-widget",
          ".article-meta-row",
          ".article-hero-image",
          ".rich-content > *",
          ".partner-map img",
          ".job-card",
          ".faq-list details",
          ".imported-content .team-card",
          ".imported-content .tech-card",
        ].join(","),
      ),
    ).filter((element) => !element.closest(".home-hero") && !element.closest(".page-hero"));

    if (!targets.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.14 },
    );

    targets.forEach((element, index) => {
      element.classList.add("reveal-item");
      element.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 70}ms`);
      if (!element.classList.contains("is-visible")) observer.observe(element);
    });

    return () => observer.disconnect();
  });
}

export function useSummaryMotion(pathKey) {
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const targets = Array.from(document.querySelectorAll(".summary-band"));
    if (!targets.length) return undefined;

    const enableMotion = (element) => {
      element.classList.add("summary-motion-ready");
      const video = element.querySelector(".summary-video[data-src]");
      if (!video || video.src) return;

      video.src = video.dataset.src;
      video.load();

      const playVideo = () => {
        video.play().catch(() => {});
      };

      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        playVideo();
      } else {
        video.addEventListener("canplay", playVideo, { once: true });
      }
    };

    if (!("IntersectionObserver" in window)) {
      const timer = window.setTimeout(() => targets.forEach(enableMotion), 900);
      return () => window.clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          enableMotion(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "520px 0px", threshold: 0.01 },
    );

    targets.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathKey]);
}
