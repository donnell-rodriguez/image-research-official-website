import { ContactBlock } from "../components/ContactBlock";
import { InnerPageHero } from "../components/InnerPageHero";

export function ContactPage() {
  return (
    <>
      <InnerPageHero
        eyebrow="Contact ADV"
        title="Contact Us"
        text="Connect with Advantage Data Vision for partnership, publication, product, and clinical collaboration enquiries."
        variant="contact"
      />
      <section className="section home-contact-band contact-page-band">
        <ContactBlock showLogos={false} ctaMode="email" />
      </section>
    </>
  );
}
