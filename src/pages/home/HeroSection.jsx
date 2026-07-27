import { Link } from "@tanstack/react-router";
import { siteImages, siteTagline } from "../../data/site";

export function HeroSection() {
  return (
    <section className="hero-section home-hero">
      <div className="hero-copy">
        <span className="eyebrow">Welcome</span>
        <h1>
          <span>The Best</span>
          <span className="hero-solution">SOLUTION</span>
          <span>For Healthcare</span>
          <span>Industry</span>
        </h1>
        <div className="hero-actions">
          <Link to="/about-us/" className="button button-primary">
            Learn More
          </Link>
          <Link to="/contact/" className="button button-secondary">
            Contact Us
          </Link>
        </div>
        <blockquote>
          <p>{siteTagline}</p>
          <cite>Advantage Data Vision</cite>
        </blockquote>
      </div>
      <div className="hero-visual" aria-hidden="true">
        <div className="hero-visual-circle">
          <h2>Advantage Data Vision</h2>
          <img src={siteImages.hero} alt="" fetchPriority="high" decoding="async" />
        </div>
      </div>
      <div className="hero-fold" aria-hidden="true" />
    </section>
  );
}
