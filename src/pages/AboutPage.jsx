import { Link } from "@tanstack/react-router";
import { siteImages } from "../data/site";
import { useSeo } from "../hooks/useSeo";

const metrics = [
  ["2021", "Research journey started at The Hong Kong Polytechnic University"],
  ["20+", "Years of medical AI experience from the founding research team"],
  ["HCC", "Focused clinical scenario for personalized liver cancer treatment"],
];

const capabilities = [
  {
    title: "Clinical Intelligence",
    text:
      "We combine imaging, pathology, genomic signals, and clinical context to support more precise treatment planning.",
  },
  {
    title: "AI Simulation",
    text:
      "Virtual Patient Simulation helps physicians compare possible outcomes before treatment decisions are made.",
  },
  {
    title: "Real-world Search",
    text:
      "Similar-patient search connects new clinical cases with comparable historical outcomes for practical reference.",
  },
];

const founders = [
  {
    id: "lawrence-chan",
    eyebrow: "About-our founder",
    name: "Dr. Lawrence Chan 陳穎志博士",
    credential: "PhD in AI, BEng (First Class Hon.)",
    image: siteImages.founder,
    width: 683,
    height: 1024,
    alt: "Dr. Lawrence Chan, founder of Advantage Data Vision",
    bullets: [
      ">20-year experience in Medical AI",
      "Associate Professor, PolyU",
      "Guest Professor of Zhejiang University",
      "Expert Panel Member of HKSTP",
      "Panel Member of Enterprise Support Scheme",
      "Affiliate Member of HKSMI",
    ],
  },
  {
    id: "xiang-yiting",
    eyebrow: "About",
    name: "XIANG YITING",
    credential: "Founder and medical engineering lead",
    image: siteImages.cofounder,
    width: 768,
    height: 1024,
    alt: "XIANG Yiting, founder and medical engineering lead of Advantage Data Vision",
    reverse: true,
    bullets: [
      "Founder of Ningxia XinGuang Medical Technology Limited (2021-23, Entrepreneurship Program: National Silver Award)",
      "Master of Science in Medical Engineering (Distinction), CityU",
      "Bachelor of Medical Radiologic Technology",
    ],
  },
];

const faqs = [
  [
    "What does ADV build?",
    "ADV builds AI-driven virtual patient simulation and similar-patient search systems for personalized clinical decision support.",
  ],
  [
    "Why focus on liver cancer?",
    "Liver cancer treatment decisions are complex and often require integrated evidence from imaging, pathology, genomics, and longitudinal outcomes.",
  ],
  [
    "Who is the product designed for?",
    "The system is designed for hospitals, clinicians, researchers, insurers, and healthcare partners exploring precision oncology workflows.",
  ],
];

export function AboutPage() {
  useSeo({
    title: "About ADV",
    description:
      "Learn about Advantage Data Vision, a PolyU-incubated medical AI company translating healthcare data into clinical decision support systems.",
    path: "/about-us/",
    image: siteImages.team,
  });

  return (
    <article className="about-page">
      <section className="about-hero">
        <div className="about-hero-copy">
          <span className="eyebrow">About ADV</span>
          <h1>Translating medical data into clearer clinical decisions.</h1>
          <p>
            Advantage Data Vision is a PolyU-incubated medical AI company applying university research,
            deep learning, and clinical collaboration to personalized treatment planning.
          </p>
          <div className="about-actions">
            <a href="#lawrence-chan" className="button button-primary">
              Learn More
            </a>
            <Link to="/contact/" className="button button-secondary about-secondary-button">
              Contact ADV
            </Link>
          </div>
        </div>
        <figure className="about-hero-media">
          <img src={siteImages.founder} alt="ADV founder and research team member" width="683" height="1024" />
        </figure>
      </section>

      <section className="about-metrics" aria-label="ADV highlights">
        {metrics.map(([value, label]) => (
          <div key={value} className="about-metric">
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="about-story-section">
        <div className="about-story-copy">
          <span className="eyebrow">Our Story</span>
          <h2>From university research to clinical-grade healthcare AI.</h2>
          <p>
            Our journey started in 2021 in a Hong Kong Polytechnic University lab, where scientific
            research, AI engineering, and healthcare delivery came together around one practical goal:
            helping clinicians make more informed decisions before treatment.
          </p>
          <p>
            Today, our work focuses on virtual patient simulation, personalized deep features, and
            real-world data search for precision oncology. The product direction remains intentionally
            narrow: reliable clinical support, clear evidence, and deployable systems for healthcare teams.
          </p>
        </div>
        <figure className="about-story-media">
          <img src={siteImages.team} alt="Advantage Data Vision team" width="1024" height="683" loading="lazy" decoding="async" />
        </figure>
      </section>

      <section className="about-capability-section" aria-labelledby="about-capability-title">
        <div className="section-heading">
          <span className="eyebrow">Capability</span>
          <h2 id="about-capability-title">Built for medical AI workflows</h2>
          <p>
            The platform is designed around clinical evidence, model output, and case comparison instead
            of generic analytics dashboards.
          </p>
        </div>
        <div className="about-capability-grid">
          {capabilities.map((item, index) => (
            <article key={item.title} className="about-capability-card">
              <span className="about-card-number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-leadership-section">
        <div className="about-leadership-heading">
          <span className="eyebrow">Leadership</span>
          <h2>Medical AI expertise with clinical translation in mind.</h2>
        </div>
        <div className="about-founder-list">
          {founders.map((founder) => (
            <article
              key={founder.id}
              id={founder.id}
              className={`about-founder-profile${founder.reverse ? " about-founder-profile-reverse" : ""}`}
            >
              <div className="about-founder-copy">
                <span className="eyebrow">{founder.eyebrow}</span>
                <h3>{founder.name}</h3>
                <p className="about-founder-credential">{founder.credential}</p>
                <ul>
                  {founder.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <a href={`#${founder.id}`} className="button button-primary">
                  Learn More
                </a>
              </div>
              <figure className="about-founder-media">
                <img
                  src={founder.image}
                  alt={founder.alt}
                  width={founder.width}
                  height={founder.height}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </article>
          ))}
        </div>
      </section>

      <section className="about-faq-section">
        <div className="about-faq-heading">
          <span className="eyebrow">F.A.Q</span>
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="about-faq-list">
          {faqs.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </article>
  );
}
