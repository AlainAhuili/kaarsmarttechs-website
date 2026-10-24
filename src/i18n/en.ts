// English texts. de.ts and fr.ts must have exactly the same keys (checked by `astro check`).
export default {
  meta: { name: "English", short: "EN", ogLocale: "en_GB" },
  nav: {
    home: "Kaar Smart Techs, home",
    projects: "Projects",
    services: "Services",
    about: "About us",
    cta: "Get in touch",
    menu: "Menu",
    main: "Main",
    skip: "Skip to content",
    language: "Language",
  },
  footer: {
    blurb: "Vision, embedded and cloud systems.",
    place: "Delmenhorst, Germany",
    legal: "Legal",
    impressum: "Impressum",
    privacy: "Privacy policy",
    contact: "Contact",
    lego: "LEGO® is a trademark of the LEGO Group, which does not sponsor, authorise or endorse this website.",
  },
  status: {
    "In development": "In development",
    Internal: "Internal",
    "Client work": "Client work",
  },
  categories: {
    "Computer Vision": "Computer Vision",
    "Embedded Systems": "Embedded Systems",
    "Cloud & DevOps": "Cloud & DevOps",
    "AI & Agentic Tooling": "AI & Agentic Tooling",
    "Code Quality": "Code Quality",
  },
  sorter: {
    title:
      "A conveyor carries coloured bricks past a camera, and each brick is pushed into the bin that matches its colour.",
    bins: ["Vision", "Embedded", "Cloud"],
  },
  home: {
    description:
      "Kaar Smart Techs bridges software and hardware with Edge AI, embedded systems and robust cloud infrastructure. Based in Delmenhorst, Germany.",
    badge: "Edge AI, embedded systems and cloud infrastructure",
    intro:
      "We bridge high-performance software with hardware. By processing data at the edge, right where machines and sensors operate, our solutions eliminate cloud latency, cut infrastructure costs and deliver maximum reliability without sacrificing data security.",
    explore: "Explore capabilities",
    partner: "Partner with us",
    stats: [
      { value: "Edge AI", label: "Processing where machines run" },
      { value: "100%", label: "On-device autonomy" },
      { value: "NPU · Jetson", label: "Embedded targets" },
      { value: "Germany", label: "Delmenhorst hub" },
    ],
    capabilitiesEyebrow: "Key technical pillars",
    capabilitiesTitle: "From the sensor to the cloud",
    capabilitiesText:
      "Four disciplines, delivered by one team, so vision, embedded code, AI tooling and infrastructure fit together from day one.",
    capabilities: [
      {
        name: "Vision and inspection systems",
        text: "Low-latency OpenCV pipelines, camera setups and custom classification models for real-time work such as high-speed part sorting and 3D precision welding robotics.",
      },
      {
        name: "Embedded and systems engineering",
        text: "Lightweight, energy-efficient C++ and C# software running directly on constrained targets (NPU, Jetson and specialised microcontrollers) for predictable real-time performance.",
      },
      {
        name: "Agentic AI and MCP integrations",
        text: "Secure Model Context Protocol servers connecting AI assistants, RAG diagnostic tools and local equipment, without compromising your IP or network autonomy.",
      },
      {
        name: "Hybrid cloud and delivery pipelines",
        text: "Enterprise-grade cloud architecture with Terraform, Kubernetes and AWS, and continuous integration with strict code-quality gates.",
      },
    ],
    howWeWork: "How we work with you",
    portfolioEyebrow: "Our core portfolio",
    portfolioTitle: "Where software meets hardware",
    portfolioText:
      "What we are building, from vision-guided sorting and embedded inspection to smart utility products and solar installations, with an honest status on each one.",
    featured: {
      "lego-sorting-system": {
        tag: "Automation & AI",
        highlights: [
          "Real-time image recognition and bounding boxes",
          "Mechanical conveyor and sorting feeder",
          "Custom microcontroller and motor integration",
        ],
      },
      "travel-hygienic-wc-seat-frame": {
        tag: "Smart Health & Utility",
        highlights: [
          "Compact folding architecture for transit",
          "Touch-free UV-C disinfection module",
          "Lightweight metal frame",
        ],
      },
      "solar-led-wireframe-sculptures": {
        tag: "Sustainable Art & Tech",
        highlights: [
          "Miniature photovoltaic cells",
          "Weatherproof welded wireframe structures",
          "Dusk-to-dawn lighting control",
        ],
      },
      "embedded-vision-toolkit": {
        tag: "Embedded Vision",
        highlights: [
          "Camera capture and lighting normalisation",
          "Segmentation and on-device inference",
          "Reusable C++ modules with a stable interface",
        ],
      },
    },
    statusLabel: "Status: {status}",
    caseStudy: "Case study",
    seeAll: "See all projects",
    aboutEyebrow: "About Kaar Smart Techs",
    aboutTitle: "Rooted in Delmenhorst, engineering for the globe",
    aboutP1Before:
      "Kaar Smart Techs bridges high-performance software with hardware through localised processing (Edge AI), embedded systems and robust cloud infrastructure. Working from",
    aboutPlace: "Delmenhorst, Lower Saxony, Germany",
    aboutP1After: ", we combine German engineering discipline with creative, future-proof design.",
    aboutP2:
      "Whether we are building automated sorting machines, vision-guided robotics or secure AI integrations, our commitment stays the same:",
    advantage: "Strategic advantage",
    pillars: [
      {
        name: "100% on-device autonomy",
        text: "No dependency on a constant internet connection, so critical machinery keeps running through network disruptions.",
      },
      {
        name: "Turnkey engineering",
        text: "Full-lifecycle delivery, from quantised model deployment and hardware optimisation to audit-ready codebases.",
      },
    ],
    missionTitle: "Core mission and value",
    values: [
      {
        name: "No cloud latency",
        text: "Data is processed right where machines and sensors operate, so decisions happen in real time.",
      },
      {
        name: "Lower infrastructure costs",
        text: "Less data shipped to and stored in the cloud means smaller bills and simpler infrastructure.",
      },
      {
        name: "Reliability without compromise",
        text: "Maximum operational reliability, with sensitive production data kept on site.",
      },
    ],
    contactEyebrow: "Get in touch",
    contactTitle: "Let's build the future together",
    contactText:
      "Have a project inquiry or a collaboration proposal, or want to explore our technologies? Reach out to our Delmenhorst team.",
    hq: "Headquarters",
    hqLines: ["Delmenhorst, Lower Saxony", "Germany"],
    emailUs: "Email us",
    responseTitle: "Response time",
    responseText: "We reply within two working days.",
    panelTitle: "Tell us about your project",
    panelText:
      "Describe what you want to detect, sort or automate, and roughly when you need it. We'll get back to you with next steps.",
    send: "Send us a message",
  },
  services: {
    title: "Services",
    description:
      "Engineering services from Kaar Smart Techs: Edge AI vision systems, embedded software, MCP integrations, hybrid cloud pipelines and code quality audits.",
    lead: "We bridge high-performance software with hardware. By processing data at the edge, right where machines and sensors operate, we remove cloud latency, cut infrastructure costs and keep your data on site.",
    items: [
      {
        name: "Vision and inspection systems",
        text: "Low-latency OpenCV pipelines, camera setup and lighting, and custom classification models for real-time applications such as high-speed part sorting and 3D precision welding robotics.",
      },
      {
        name: "Embedded and systems engineering",
        text: "Lightweight, energy-efficient C++ and C# software running directly on constrained targets (NPU, Jetson and specialised microcontrollers) for predictable real-time performance.",
      },
      {
        name: "Agentic AI and MCP integrations",
        text: "Secure Model Context Protocol servers connecting AI assistants, RAG diagnostic tools and local equipment, with human confirmation where it matters and without compromising your IP or network autonomy.",
      },
      {
        name: "Hybrid cloud and delivery pipelines",
        text: "Enterprise-grade cloud architecture as code with Terraform, containerised services on Kubernetes and AWS, and continuous integration with approval gates.",
      },
      {
        name: "Code quality audits",
        text: "Static analysis and strict test gates for C++, Python and TypeScript repositories, set up and tuned for your codebase so it stays audit-ready.",
      },
    ],
    advantageTitle: "Strategic advantage",
    advantages: [
      {
        name: "100% on-device autonomy",
        text: "No dependency on a constant internet connection, so critical industrial machinery keeps running reliably through network disruptions.",
      },
      {
        name: "Turnkey engineering",
        text: "Full-lifecycle delivery, from quantised model deployment and hardware optimisation to audit-ready codebases.",
      },
    ],
    cta: "Discuss your project",
  },
  projects: {
    title: "Projects",
    description:
      "Projects by Kaar Smart Techs in computer vision, embedded systems, cloud and DevOps, and agentic tooling.",
    lead: "What we are building, with an honest status on each one. Results are published once they are measured.",
    filterLabel: "Filter projects by category",
    all: "All",
    countOne: "{n} project",
    countMany: "{n} projects",
  },
  project: {
    status: "Status",
    categories: "Categories",
    builtWith: "Built with",
    builtWithList: "Built with {list}",
    problem: "The problem",
    results: "Results",
    resultsNote: "We publish measured numbers only. Open values are still being measured.",
    measuring: "Measuring",
    next: "Talk to us about a similar project",
  },
  contact: {
    title: "Contact",
    description: "Contact Kaar Smart Techs in Delmenhorst, Germany.",
    lead: "Describe what you want to detect, sort or automate, and roughly when you need it. We reply within two working days.",
    email: "Email {email}",
    place: "Delmenhorst, Lower Saxony, Germany",
  },
  impressum: {
    title: "Impressum",
    description: "Legal notice for Kaar Smart Techs.",
    info: "Information according to § 5 DDG",
    address: ["[Legal form]", "[Street and number]", "[Postcode] Delmenhorst", "Germany"],
    represented: "Represented by",
    representedValue: "[Name of owner or managing director]",
    contact: "Contact",
    email: "Email: {email}",
    phone: "Phone: {phone}",
    phoneValue: "[Phone number]",
    register: "Register entry",
    registerValue: "[Register court and number, if registered in the Handelsregister]",
    vat: "VAT ID",
    vatValue: "[USt-IdNr. according to § 27a UStG, if available]",
  },
  privacy: {
    title: "Privacy policy",
    description: "Privacy policy (Datenschutzerklärung) for Kaar Smart Techs.",
    intro:
      "This website sets no cookies, uses no analytics and loads no content from third parties. Fonts are served from our own server.",
    controller: "Controller",
    controllerText:
      "Kaar Smart Techs, [address], Delmenhorst, Germany. Email: hello@kaarsmarttechs.com",
    logs: "Server log files",
    logsText:
      "Our hosting provider [name, location] processes the IP address, time and requested page to deliver the site and keep it secure (Art. 6(1)(f) GDPR). Logs are deleted after [n] days.",
    email: "Contact by email",
    emailText:
      "When you email us, we process your message to answer it (Art. 6(1)(b) GDPR) and delete it when it is no longer needed, unless statutory retention periods apply.",
    rights: "Your rights",
    rightsText:
      "You have the right to access, rectification, erasure, restriction of processing, data portability and objection, and the right to lodge a complaint with a supervisory authority such as the Landesbeauftragte für den Datenschutz Niedersachsen.",
  },
};
