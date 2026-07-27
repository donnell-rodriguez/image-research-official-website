import { Link } from "@tanstack/react-router";
import { Feature } from "../components/Feature";
import { Icon } from "../components/Icon";
import { PageHero } from "../components/PageHero";

const jobRequirements = [
  "Valid legal status or visa to work in Hong Kong.",
  "Computer Science, Medical Imaging, Biomedical Engineering, or related background.",
  "Hands-on deep learning experience, preferably in healthcare or medical imaging.",
  "Independent software development experience and the ability to ship reliable product features.",
];

export function CareerPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers at ADV"
        title="Build AI systems for precision healthcare."
        text="Join a focused medical technology team developing virtual patient simulation, AI model pipelines, and clinical decision support products."
      />

      <section className="section career-page-section">
        <div className="career-intro-grid">
          <div className="split-copy">
            <span className="eyebrow">Join Our Team</span>
            <h2>Engineering roles with direct clinical impact</h2>
            <p>
              ADV is looking for engineers who can work across AI model development,
              medical imaging workflows, and production software. The work is practical,
              research-driven, and connected to hospital-facing product delivery.
            </p>
          </div>
          <div className="feature-list">
            <Feature icon={<Icon name="network" />} title="AI model development">
              Build and validate deep learning models for virtual patient simulation and outcome prediction.
            </Feature>
            <Feature icon={<Icon name="stethoscope" />} title="Healthcare product focus">
              Work with medical imaging, pathology, genomics, and clinical decision support workflows.
            </Feature>
            <Feature icon={<Icon name="shield" />} title="Reliable engineering">
              Turn research prototypes into maintainable systems that can support clinical collaboration.
            </Feature>
          </div>
        </div>

        <div className="job-card career-job-card">
          <span className="eyebrow">Join Our Team</span>
          <h2>AI / Deep Learning Engineer (Healthcare)</h2>
          <p>
            We are seeking talented engineers to develop AI models for our Virtual
            Patient Simulation System.
          </p>
          <div className="job-meta">
            <span>Full-time / Part-time</span>
            <span>Flexible, PolyU Campus welcomed</span>
            <span>2 Openings</span>
            <span>HKD 17,000 / month</span>
          </div>
          <ul>
            {jobRequirements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="career-apply-row">
            <p>
              Email <a href="mailto:abc.adamtsui@gmail.com">abc.adamtsui@gmail.com</a>
              {" "}or call <a href="tel:+85291330397">+852 91330397</a>.
            </p>
            <Link to="/contact/" className="button button-primary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
