import { Link } from "@tanstack/react-router";
import { siteImages } from "../../data/site";

const aiInputItems = [
  {
    label: "Clinical Info. Genomics",
    image: siteImages.aiWorkflow.clinical,
    alt: "Clinical information and genomics inputs",
  },
  {
    label: "Imaging",
    image: siteImages.aiWorkflow.imaging,
    alt: "Medical imaging inputs",
  },
  {
    label: "Pathology",
    image: siteImages.aiWorkflow.pathology,
    alt: "Pathology image inputs",
  },
];

export function AiWorkflowSection() {
  const workflow = siteImages.aiWorkflow;

  return (
    <section className="ai-workflow-web" aria-label="AI model input and output workflow">
      <article className="ai-workflow-block ai-workflow-input-block">
        <h3>Input</h3>
        <div className="ai-input-card">
          {aiInputItems.map((item) => (
            <div className="ai-input-item" key={item.label}>
              <img
                src={item.image}
                alt={item.alt}
                loading="lazy"
                decoding="async"
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </article>

      <span className="ai-workflow-arrow ai-workflow-arrow-input" aria-hidden="true" />

      <article className="ai-workflow-block ai-workflow-model-block">
        <h3>AI Model</h3>
        <div className="ai-model-graphic-wrap">
          <img
            className="ai-model-graphic"
            src={workflow.model}
            alt="ADV artificial intelligence model network"
            width="250"
            height="486"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="ai-model-mobile-medium">
          <span>Mobile Medium</span>
        </div>
      </article>

      <span className="ai-workflow-arrow ai-workflow-arrow-output" aria-hidden="true" />

      <article className="ai-workflow-block ai-workflow-output-block">
        <div className="ai-output-heading">
          <h3>Output</h3>
          <p>
            Disease Prediction + Treatment Effectiveness Prediction + Similar
            Patient Search + Disease Progression Forecasting
          </p>
        </div>

        <div className="ai-output-card">
          <section className="ai-output-panel ai-output-prediction">
            <h4>Disease Prediction</h4>
            <img
              src={workflow.riskbar}
              alt="Disease prediction risk distribution"
              width="170"
              height="48"
              loading="lazy"
              decoding="async"
            />
          </section>

          <section className="ai-output-panel ai-output-search">
            <div className="ai-output-panel-copy">
              <h4>Similar Patient Search</h4>
            </div>
            <div className="ai-output-search-media">
              <span className="ai-output-person ai-output-new-case" aria-hidden="true" />
              <span className="ai-output-search-label">search</span>
              <img
                src={workflow.database}
                alt="Real-case patient database"
                width="112"
                height="104"
                loading="lazy"
                decoding="async"
              />
              <span className="ai-output-review-person" aria-hidden="true" />
              <span className="ai-output-review-label">Review</span>
              <img
                src={workflow.table}
                alt="Similar cases and treatment outcomes table"
                width="144"
                height="112"
                loading="lazy"
                decoding="async"
              />
              <span className="ai-output-doctor" aria-hidden="true" />
            </div>
          </section>

          <section className="ai-output-panel ai-output-treatment">
            <div className="ai-output-panel-copy">
              <h4>Treatment Effectiveness Prediction + Disease Progression Forecasting</h4>
              <div className="ai-output-combine">combine with:</div>
              <ul>
                <li>Relapse</li>
                <li>Survival</li>
                <li>Co-morbidities</li>
                <li>Combined treatment</li>
              </ul>
            </div>
            <div className="ai-output-generate">
              <span>Generate</span>
              <span className="ai-output-generate-arrow" aria-hidden="true" />
              <span className="ai-output-doctor ai-output-generate-doctor" aria-hidden="true" />
            </div>
            <figure>
              <img
                src={workflow.record}
                alt="Generated personalized outcome prediction record"
                width="174"
                height="116"
                loading="lazy"
                decoding="async"
              />
              <figcaption>Personalized outcome prediction for new case</figcaption>
            </figure>
          </section>
        </div>
      </article>
    </section>
  );
}

export function ProjectsSection() {
  return (
    <section className="section product-section projects-section">
      <div className="product-media">
        <img
          src={siteImages.platform}
          alt="AI simulation systems workflow"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="product-copy">
        <span className="eyebrow">Our Solution</span>
        <h2>
          <strong>Our Projects</strong> for you
        </h2>
        <p>
          Cancer, especially liver cancer, remains a major health issue.
          Despite advances in treatment and drug development, many patients
          still don’t achieve ideal results. The reasons are unclear, often
          due to tumor complexity, genetic differences, and unpredictable
          treatment responses. Our deep learning solution helps bridge this
          gap by providing personalized treatment plans using imaging,
          pathology, and genomic data.
        </p>
        <Link to="/adv-medicare-limited/" className="button button-primary">
          Learn More
        </Link>
      </div>
    </section>
  );
}

export function SolutionStepsSection() {
  return (
    <section className="solution-steps-section" aria-label="Advantage Data Vision solution systems">
      <ol className="solution-step-list">
        <li className="solution-step">
          <h3>AI-based Outcome Simulation Systems</h3>
        </li>
        <li className="solution-step">
          <h3>Personalized Deep Features using QR code</h3>
        </li>
        <li className="solution-step">
          <h3>Similar Patient Search Systems</h3>
        </li>
      </ol>
    </section>
  );
}

export function ProductsOverviewSection() {
  return (
    <section className="products-overview-section" aria-label="Our Products and Services">
      <div className="products-overview-inner">
        <div className="section-heading products-overview-heading">
          <h2>Our Products and Services</h2>
        </div>

        <ProductFlowShowcase />
        <AiWorkflowSection />
      </div>
    </section>
  );
}

export function ProductFlowShowcase() {
  return (
    <>
      <div className="product-flow-card">
        <div className="product-flow-diagram" aria-label="ADV product exchange workflow">
          <div className="product-flow-summary">
            <p>We sell:</p>
            <ul>
              <li>Virtual Patient Simulation Systems</li>
              <li>Personalized Deep Features exchanged by QR code</li>
              <li>Real-World Data Search Systems</li>
            </ul>
          </div>

          <article className="product-flow-node product-flow-vps">
            <h3>Virtual Patient Simulation Systems</h3>
            <img
              src={siteImages.productSlices.virtualPatient}
              alt="Virtual patient simulation workstation"
              width="238"
              height="198"
              loading="lazy"
              decoding="async"
            />
          </article>

          <span className="product-flow-arrow product-flow-arrow-forward" aria-hidden="true" />

          <article className="product-flow-node product-flow-deep">
            <h3>Deep Features in Profile and Simple Text</h3>
            <img
              src={siteImages.productSlices.deepFeatures}
              alt="Deep feature profile and simple text QR code interface"
              width="292"
              height="244"
              loading="lazy"
              decoding="async"
            />
          </article>

          <span className="product-flow-arrow product-flow-arrow-exchange" aria-hidden="true" />

          <div className="product-flow-exchange">
            <article className="product-flow-node product-flow-search">
              <h3>Real-World Data Search</h3>
              <img
                src={siteImages.productSlices.realWorldSearch}
                alt="Real-world data search interface"
                width="196"
                height="140"
                loading="lazy"
                decoding="async"
              />
            </article>

            <span className="product-flow-arrow-vertical" aria-hidden="true" />

            <article className="product-flow-node product-flow-qr">
              <h3>QR code as Standard Exchange Format</h3>
              <img
                src={siteImages.productSlices.qrCode}
                alt="ADV QR code exchange format"
                width="190"
                height="180"
                loading="lazy"
                decoding="async"
              />
              <p>Proprietary and Confidential</p>
            </article>
          </div>
        </div>
      </div>

      <div className="products-overview-notes">
        <p>
          Virtual patient simulation could help determine which treatment
          option would provide the optimal benefit to a patient before
          treatment.{" "}
          AI-encoded biomarkers accompanied by the simulation, so-called
          Deep features, individually characterize the clinical outcome
          prediction in an “omics-like” profile.{" "}
          Using a QR code, Deep Features of a patient before treatment can
          be exchanged between healthcare units to search for the real-world
          data of similar cases with known clinical outcomes.
        </p>
      </div>
    </>
  );
}

export function SummarySection() {
  return (
    <section className="section summary-band">
      <video
        className="summary-video"
        poster="/assets/summary-city-street.webp"
        muted
        loop
        playsInline
        preload="none"
        data-src="/assets/summary-city-street.mp4"
        aria-hidden="true"
      />
      <span className="eyebrow">Summaries</span>
      <h2>SUMMARIES</h2>
      <p>
        Overall, we sell Virtual Patient Simulation Systems, Personalized Deep
        Features, and Real-World Data Search Systems to healthcare sectors,
        insurance companies, patients, and the public. As over 19 million new
        cancer cases are reported globally each year, we anticipate the gross
        margin will approach 90% and profits $107M in 4 years.
      </p>
      <Link to="/contact/" className="button button-primary">
        Learn More
      </Link>
    </section>
  );
}

export function PartnersSection() {
  return (
    <section className="section partners-band">
      <div className="section-heading">
        <h2>
          <span>
            Trusted by <strong>Partners</strong>
          </span>
        </h2>
      </div>
      <figure className="partner-map">
        <img
          src={siteImages.partnerNetwork}
          alt="Advantage Data Vision commercialization and clinical research partner network"
          width="1024"
          height="447"
          loading="lazy"
          decoding="async"
        />
      </figure>
    </section>
  );
}
