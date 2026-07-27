import { Link } from "@tanstack/react-router";
import { contactDetails, siteImages, siteTagline } from "../data/site";
import { Icon, SocialIcon } from "./Icon";

export function ContactBlock({ showLogos = true, ctaMode = "route" }) {
  const ctaClassName = "button button-primary";
  const cta =
    ctaMode === "email" ? (
      <a href={`mailto:${contactDetails.email}`} className={ctaClassName}>
        Contact Us
      </a>
    ) : (
      <Link to="/contact/" className={ctaClassName}>
        Contact Us
      </Link>
    );

  return (
    <>
      {showLogos ? (
        <div className="contact-logo-strip" aria-label="Selected partners">
          {siteImages.contactLogos.map((src) => (
            <img key={src} src={src} alt="" loading="lazy" decoding="async" />
          ))}
        </div>
      ) : null}
      <div className="home-contact-layout">
        <div className="contact-copy">
          <span className="eyebrow">Contact</span>
          <h2>
            Be in <strong>Touch</strong>
          </h2>
          <blockquote>
            <p>” {siteTagline} “</p>
          </blockquote>
          <div className="social-links" aria-label="Social links">
            <a href="#" aria-label="Facebook">
              <SocialIcon name="facebook" />
            </a>
            <a href="#" aria-label="Twitter">
              <SocialIcon name="twitter" />
            </a>
            <a href="#" aria-label="YouTube">
              <SocialIcon name="youtube" />
            </a>
            <a href="#" aria-label="Skype">
              <SocialIcon name="skype" />
            </a>
          </div>
          <address className="contact-list">
            <span>
              <Icon name="pin" size={22} /> {contactDetails.address}
            </span>
            <span>
              <Icon name="phone" size={22} /> {contactDetails.phone}
            </span>
            <span>
              <Icon name="mail" size={22} /> {contactDetails.email}
            </span>
          </address>
          {cta}
        </div>
        <a
          className="contact-map"
          href={contactDetails.mapUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Open map to The Hong Kong Polytechnic University"
        >
          <img
            src={siteImages.contactMap}
            alt="Map to The Hong Kong Polytechnic University"
            width="610"
            height="522"
            loading="lazy"
            decoding="async"
          />
        </a>
      </div>
    </>
  );
}
