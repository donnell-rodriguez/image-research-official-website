import { Link } from "@tanstack/react-router";
import { Feature } from "../../components/Feature";
import { Icon } from "../../components/Icon";

export function ServicesSection() {
  return (
    <section className="section split-section services-section">
      <div className="split-copy">
        <span className="eyebrow">Our services</span>
        <h2>Best Solution for you</h2>
        <p>
          Our deep learning service focuses on developing personalized
          treatment plans for liver cancer patients by integrating imaging,
          pathology, and genomic data, providing comprehensive disease
          assessment and precise treatment recommendations. Our system
          leverages advanced deep learning models to automate the analysis of
          liver images, while also incorporating genomic data to offer doctors
          tailored recommendations for targeted therapies, treatment efficacy
          predictions, and prognostic assessments. Additionally, we provide a
          similar patient search feature, enabling physicians to access
          comparative pathology data to aid in treatment planning.
        </p>
        <p>
          The solution enhances early liver cancer detection and enables
          real-time monitoring of treatment responses, ensuring the most
          appropriate therapeutic approach for each patient. Moreover, our
          service is currently undergoing multi-center clinical validation to
          ensure its feasibility and safety in clinical practice.
        </p>
        <Link to="/about-us/" className="button button-primary">
          Learn More
        </Link>
      </div>
      <div className="feature-list">
        <Feature icon={<Icon name="pulse" />} title="Personalized Liver Cancer Treatment">
          Integrates imaging, pathology, and genomic data for precise
          treatment plans.
        </Feature>
        <Feature icon={<Icon name="search" />} title="Similar Patient Search">
          Identifies comparable cases to assist doctors in treatment planning.
        </Feature>
        <Feature icon={<Icon name="scope" />} title="Advanced Deep Learning Models">
          Automates liver image analysis and provides tailored drug
          recommendations.
        </Feature>
        <Feature icon={<Icon name="shield" />} title="Improved Detection & Monitoring">
          Enhances early detection and tracks treatment responses in real time.
        </Feature>
      </div>
    </section>
  );
}
