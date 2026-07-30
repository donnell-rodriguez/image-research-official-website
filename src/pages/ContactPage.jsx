import { ContactBlock } from "../components/ContactBlock";
import { InnerPageHero } from "../components/InnerPageHero";
import { siteImages } from "../data/site";
import { useSeo } from "../hooks/useSeo";

export function ContactPage() {
  useSeo({
    title: "Contact ADV",
    description:
      "Contact Advantage Data Vision for product enquiries, clinical collaboration, partnerships, publications, and healthcare AI discussions.",
    path: "/contact/",
    image: siteImages.contactMap,
  });

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
