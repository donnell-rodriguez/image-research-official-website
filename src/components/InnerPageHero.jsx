import { siteImages } from "../data/site";

export function InnerPageHero({ eyebrow, title, text, variant = "default" }) {
  return (
    <section
      className={`inner-page-hero inner-page-hero-${variant}`}
      style={{ "--inner-hero-bg": `url(${siteImages.hero})` }}
    >
      <div className="inner-page-hero-copy">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      <div className="inner-page-hero-fold" aria-hidden="true" />
    </section>
  );
}
