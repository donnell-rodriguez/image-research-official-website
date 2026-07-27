import { siteImages } from "../data/site";

export function PageHero({ eyebrow, title, text, image }) {
  return (
    <section
      className="page-hero"
      style={{ "--hero-bg": `url(${image || siteImages.hero})` }}
    >
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      {image && <img src={image} alt="" />}
    </section>
  );
}
