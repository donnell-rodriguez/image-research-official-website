export const siteImages = {
  logo: "/assets/065-cropped-51a800601fc2208afe687dfee4eb058.webp",
  hero: "/assets/017-2-1024x615.webp",
  platform: "/assets/018-20241217164407-768x390.webp",
  products: "/assets/019-3-1024x598.webp",
  productSlices: {
    virtualPatient: "/assets/generated/products-vps.webp",
    deepFeatures: "/assets/generated/products-deep-features.webp",
    realWorldSearch: "/assets/generated/products-real-world-search.webp",
    qrCode: "/assets/generated/products-qr-code.webp",
  },
  aiModel: "/assets/020-e7223ea1bee94efb9f145e2e4e3a024-1024x576.webp",
  aiWorkflow: {
    clinical: "/assets/generated/ai-workflow-clinical.jpg",
    imaging: "/assets/generated/ai-workflow-imaging.jpg",
    pathology: "/assets/generated/ai-workflow-pathology.jpg",
    model: "/assets/generated/ai-workflow-model.jpg",
    qr: "/assets/generated/ai-workflow-qr.jpg",
    database: "/assets/generated/ai-workflow-database.jpg",
    riskbar: "/assets/generated/ai-workflow-riskbar.jpg",
    table: "/assets/generated/ai-workflow-table.jpg",
    record: "/assets/generated/ai-workflow-record.jpg",
  },
  partnerNetwork: "/assets/021-4-1024x447.webp",
  demoPoster: "/assets/023-demo-poster.jpg",
  report: "/assets/019-3-1024x598.webp",
  founder: "/assets/038-20241217173958-683x1024.webp",
  cofounder: "/assets/039-56aa5d7706ea067f474a997b5aca62f-768x1024.webp",
  team: "/assets/040-20250520173247-1024x683.webp",
  demo: "/assets/023-demo.mp4",
  contactMap: "/assets/contact-map-polyu.webp",
  contactLogos: [
    "/assets/contact-logo-roche.webp",
    "/assets/contact-logo-huawei.webp",
    "/assets/contact-logo-qeh.webp",
    "/assets/contact-logo-hmu.webp",
  ],
};

export const siteTagline =
  "We harness cutting-edge AI technology for data processing, modeling, and personalized risk stratification in clinical decision support.";

export const navItems = [
  ["Home", "/"],
  ["Products", "/adv-medicare-limited/"],
  ["Events", "/blog/"],
  ["Publications", "/publications"],
  ["Contact", "/contact/"],
];

export const contactDetails = {
  address: "11 Yuk Choi Road, Hung Hom, Kowloon, Hong Kong",
  phone: "+852 3400 8561",
  email: "yunfanxiang@adv-medical.com.hk",
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=The%20Hong%20Kong%20Polytechnic%20University%2C%2011%20Yuk%20Choi%20Road%2C%20Hung%20Hom%2C%20Hong%20Kong",
};

export const footerSections = [
  {
    title: "Products",
    links: [
      { label: "Products", to: "/adv-medicare-limited/" },
      { label: "Virtual Patient Simulation Systems", to: "/adv-medicare-limited/" },
      { label: "Personalized Deep Features", to: "/adv-medicare-limited/" },
      { label: "Real-World Data Search", to: "/adv-medicare-limited/" },
    ],
  },
  {
    title: "Newsroom",
    links: [
      { label: "Newsroom", to: "/blog/" },
      { label: "Events", to: "/blog/" },
    ],
  },
  {
    title: "Publications",
    links: [
      { label: "Publications", to: "/publications" },
      { label: "Research Updates", to: "/publications" },
    ],
  },
  {
    title: "Contact Adv",
    links: [
      { label: "Contact Adv", to: "/contact/" },
      { label: "Email", href: `mailto:${contactDetails.email}` },
      { label: "Location", href: contactDetails.mapUrl },
    ],
  },
  {
    title: "About ADV",
    links: [
      { label: "About ADV", to: "/about-us/" },
      { label: "Advantage Data Vision", to: "/" },
      { label: "ADV Medicare Limited", to: "/adv-medicare-limited/" },
    ],
  },
  {
    title: "Career",
    links: [{ label: "Career", to: "/career" }],
  },
];

export const footerLegalLinks = [
  { label: "Privacy Policy", to: "/privacy-policy/" },
  { label: "Terms of Use", to: "/terms-of-use/" },
  { label: "Legal", to: "/legal/" },
  { label: "Site Map", to: "/site-map/" },
];
