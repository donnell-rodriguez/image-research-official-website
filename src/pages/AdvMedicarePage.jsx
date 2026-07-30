import { Link } from "@tanstack/react-router";
import { InnerPageHero } from "../components/InnerPageHero";
import { productPath, siteImages } from "../data/site";
import { useSeo } from "../hooks/useSeo";
import { AiWorkflowSection, ProductFlowShowcase } from "./home/ProductSections";

const productCapabilities = [
  {
    title: "Virtual Patient Simulation Systems",
    text: "Build digital twin simulations before treatment, helping clinicians compare candidate therapies and reduce avoidable waiting time.",
  },
  {
    title: "Personalized Deep Features",
    text: "Encode imaging, pathology, genomics, and clinical records into patient-level deep features that can be exchanged through a QR code format.",
  },
  {
    title: "Real-World Data Search",
    text: "Search comparable cases with known clinical outcomes, so care teams can review similar treatment paths and evidence before decision-making.",
  },
];

export function AdvMedicarePage() {
  useSeo({
    title: "Virtual Patient Simulation System",
    description:
      "ADV Medicare Limited provides a virtual patient simulation system for precision oncology, personalized deep features, QR-based exchange, and real-world case search.",
    path: productPath,
    image: siteImages.platform,
  });

  return (
    <>
      <InnerPageHero
        eyebrow="ADV Medicare Limited"
        title="Virtual Patient Simulation System"
        text="A Digital Twin driven by cutting-edge AI, dedicated to solving the clinical pain points of low immunotherapy response rates and long waiting times for Hepatocellular Carcinoma."
        variant="products"
      />

      <section className="section adv-medicare-overview">
        <div className="adv-medicare-overview-copy">
          <span className="eyebrow">Precision Oncology Platform</span>
          <h2>Clinical AI products for personalized liver cancer treatment.</h2>
          <p>
            ADV Medicare Limited turns Advantage Data Vision’s medical AI
            research into a practical product workflow for hepatocellular
            carcinoma care. The platform connects virtual patient simulation,
            patient-specific deep features, and real-world case search to help
            clinical teams evaluate treatment options before treatment starts.
          </p>
          <p>
            Instead of presenting AI as a separate research layer, the product
            packages prediction, comparison, and exchange into a lightweight
            healthcare workflow. Doctors can review AI-based outcome signals,
            search similar patient records, and share standardized deep
            features across collaborating units.
          </p>
        </div>

        <div className="adv-medicare-capability-grid">
          {productCapabilities.map((capability) => (
            <article className="adv-medicare-capability-card" key={capability.title}>
              <h3>{capability.title}</h3>
              <p>{capability.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section adv-medicare-product-flow">
        <div className="section-heading">
          <span className="eyebrow">Product Architecture</span>
          <h2>From simulation to shareable clinical features.</h2>
          <p>
            ADV Medicare combines three product layers into one decision-support
            flow: simulation, QR-based feature exchange, and real-world evidence
            search.
          </p>
        </div>
        <ProductFlowShowcase />
      </section>

      <section className="section adv-medicare-ai-flow">
        <div className="section-heading">
          <span className="eyebrow">AI Workflow</span>
          <h2>Input, model, and outcome prediction in one clinical loop.</h2>
          <p>
            Multi-dimensional patient data is processed through an AI model to
            support disease prediction, similar patient search, treatment
            effectiveness prediction, and disease progression forecasting.
          </p>
        </div>
        <AiWorkflowSection />
      </section>

      <section className="section adv-medicare-cta">
        <div>
          <span className="eyebrow">Work With ADV</span>
          <h2>Discuss how ADV Medicare can support your clinical workflow.</h2>
          <p>
            Contact the ADV team for partnerships, hospital workflow discussion,
            product demonstrations, or publication and validation enquiries.
          </p>
          <Link to="/contact/" className="button button-primary">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
