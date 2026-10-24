import type en from "./en";

// Textes français, mêmes clés que en.ts. " " = espace insécable avant : ; ? !
export default {
  meta: { name: "Français", short: "FR", ogLocale: "fr_FR" },
  nav: {
    home: "Kaar Smart Techs, accueil",
    projects: "Projets",
    services: "Services",
    about: "À propos",
    cta: "Nous contacter",
    menu: "Menu",
    main: "Navigation principale",
    skip: "Aller au contenu",
    language: "Langue",
  },
  footer: {
    blurb: "Systèmes de vision, embarqués et cloud.",
    place: "Delmenhorst, Allemagne",
    legal: "Mentions légales",
    impressum: "Mentions légales (Impressum)",
    privacy: "Protection des données",
    contact: "Contact",
    lego: "LEGO® est une marque du groupe LEGO, qui ne parraine, n’autorise ni ne cautionne ce site.",
  },
  status: {
    "In development": "En développement",
    Internal: "Interne",
    "Client work": "Projet client",
  },
  categories: {
    "Computer Vision": "Vision par ordinateur",
    "Embedded Systems": "Systèmes embarqués",
    "Cloud & DevOps": "Cloud & DevOps",
    "AI & Agentic Tooling": "IA & outils agentiques",
    "Code Quality": "Qualité du code",
  },
  sorter: {
    title:
      "Un convoyeur fait passer des briques de couleur devant une caméra, et chaque brique est poussée dans le bac de sa couleur.",
    bins: ["Vision", "Embarqué", "Cloud"],
  },
  home: {
    description:
      "Kaar Smart Techs relie logiciel et matériel grâce à l’Edge AI, aux systèmes embarqués et à une infrastructure cloud robuste. Basé à Delmenhorst, en Allemagne.",
    badge: "Edge AI, systèmes embarqués et infrastructure cloud",
    intro:
      "Nous relions des logiciels performants au matériel. En traitant les données à la périphérie, là où fonctionnent les machines et les capteurs, nos solutions suppriment la latence du cloud, réduisent les coûts d’infrastructure et offrent une fiabilité maximale sans sacrifier la sécurité des données.",
    explore: "Découvrir nos compétences",
    partner: "Travailler avec nous",
    stats: [
      { value: "Edge AI", label: "Traitement au plus près des machines" },
      { value: "100 %", label: "Autonomie sur l’appareil" },
      { value: "NPU · Jetson", label: "Plateformes embarquées" },
      { value: "Allemagne", label: "Basés à Delmenhorst" },
    ],
    capabilitiesEyebrow: "Nos piliers techniques",
    capabilitiesTitle: "Du capteur jusqu’au cloud",
    capabilitiesText:
      "Quatre disciplines réunies dans une seule équipe, pour que vision, code embarqué, outils d’IA et infrastructure s’accordent dès le premier jour.",
    capabilities: [
      {
        name: "Vision et inspection",
        text: "Pipelines OpenCV à faible latence, installations de caméras et modèles de classification sur mesure pour le temps réel, comme le tri rapide de pièces et la robotique de soudage 3D de précision.",
      },
      {
        name: "Ingénierie embarquée et systèmes",
        text: "Logiciels C++ et C# légers et économes en énergie, exécutés directement sur du matériel contraint (NPU, Jetson et microcontrôleurs spécialisés) pour des performances temps réel prévisibles.",
      },
      {
        name: "IA agentique et intégrations MCP",
        text: "Serveurs Model Context Protocol sécurisés qui relient assistants IA, outils de diagnostic RAG et équipements locaux, sans compromettre votre propriété intellectuelle ni l’autonomie de votre réseau.",
      },
      {
        name: "Cloud hybride et pipelines de livraison",
        text: "Architecture cloud de niveau entreprise avec Terraform, Kubernetes et AWS, et intégration continue avec des contrôles qualité stricts.",
      },
    ],
    howWeWork: "Notre façon de travailler avec vous",
    portfolioEyebrow: "Notre portefeuille",
    portfolioTitle: "Là où le logiciel rencontre le matériel",
    portfolioText:
      "Ce que nous construisons, du tri guidé par caméra et de l’inspection embarquée aux produits du quotidien intelligents et aux installations solaires, avec un statut honnête pour chacun.",
    featured: {
      "lego-sorting-system": {
        tag: "Automatisation & IA",
        highlights: [
          "Reconnaissance d’image en temps réel avec boîtes englobantes",
          "Convoyeur mécanique et alimentation de tri",
          "Intégration de microcontrôleur et de moteurs sur mesure",
        ],
      },
      "travel-hygienic-wc-seat-frame": {
        tag: "Santé & quotidien connectés",
        highlights: [
          "Structure pliante compacte pour les déplacements",
          "Module de désinfection UV-C sans contact",
          "Cadre métallique léger",
        ],
      },
      "solar-led-wireframe-sculptures": {
        tag: "Art & technologie durables",
        highlights: [
          "Cellules photovoltaïques miniatures",
          "Structures filaires soudées résistantes aux intempéries",
          "Éclairage du crépuscule à l’aube",
        ],
      },
      "embedded-vision-toolkit": {
        tag: "Vision embarquée",
        highlights: [
          "Capture caméra et normalisation de l’éclairage",
          "Segmentation et inférence sur l’appareil",
          "Modules C++ réutilisables à l’interface stable",
        ],
      },
    },
    statusLabel: "Statut : {status}",
    caseStudy: "Étude de cas",
    seeAll: "Voir tous les projets",
    aboutEyebrow: "À propos de Kaar Smart Techs",
    aboutTitle: "Ancrés à Delmenhorst, des solutions pour le monde entier",
    aboutP1Before:
      "Kaar Smart Techs relie des logiciels performants au matériel grâce au traitement local (Edge AI), aux systèmes embarqués et à une infrastructure cloud robuste. Depuis",
    aboutPlace: "Delmenhorst, en Basse-Saxe (Allemagne)",
    aboutP1After:
      ", nous allions la rigueur de l’ingénierie allemande à un design créatif et durable.",
    aboutP2:
      "Qu’il s’agisse de machines de tri automatiques, de robotique guidée par caméra ou d’intégrations d’IA sécurisées, notre engagement reste le même :",
    advantage: "Avantage stratégique",
    pillars: [
      {
        name: "100 % autonome sur l’appareil",
        text: "Aucune dépendance à une connexion Internet permanente : les machines critiques continuent de fonctionner pendant les coupures réseau.",
      },
      {
        name: "Ingénierie clé en main",
        text: "Un accompagnement sur tout le cycle de vie, du déploiement de modèles quantifiés et de l’optimisation matérielle jusqu’à un code prêt pour l’audit.",
      },
    ],
    missionTitle: "Mission et valeur",
    values: [
      {
        name: "Aucune latence cloud",
        text: "Les données sont traitées là où fonctionnent les machines et les capteurs, pour des décisions en temps réel.",
      },
      {
        name: "Des coûts d’infrastructure réduits",
        text: "Moins de données envoyées et stockées dans le cloud, c’est des factures plus légères et une infrastructure plus simple.",
      },
      {
        name: "Une fiabilité sans compromis",
        text: "Une fiabilité opérationnelle maximale, et les données de production sensibles restent sur site.",
      },
    ],
    contactEyebrow: "Contact",
    contactTitle: "Construisons l’avenir ensemble",
    contactText:
      "Un projet, une proposition de collaboration ou l’envie de découvrir nos technologies ? Écrivez à notre équipe de Delmenhorst.",
    hq: "Siège",
    hqLines: ["Delmenhorst, Basse-Saxe", "Allemagne"],
    emailUs: "Écrivez-nous",
    responseTitle: "Délai de réponse",
    responseText: "Nous répondons sous deux jours ouvrés.",
    panelTitle: "Parlez-nous de votre projet",
    panelText:
      "Décrivez ce que vous souhaitez détecter, trier ou automatiser, et à quelle échéance environ. Nous reviendrons vers vous avec les prochaines étapes.",
    send: "Envoyer un message",
  },
  services: {
    title: "Services",
    description:
      "Les services d’ingénierie de Kaar Smart Techs : systèmes de vision Edge AI, logiciels embarqués, intégrations MCP, pipelines cloud hybrides et audits de qualité du code.",
    lead: "Nous relions des logiciels performants au matériel. En traitant les données à la périphérie, là où fonctionnent les machines et les capteurs, nous supprimons la latence du cloud, réduisons les coûts d’infrastructure et gardons vos données sur site.",
    items: [
      {
        name: "Vision et inspection",
        text: "Pipelines OpenCV à faible latence, installation des caméras et de l’éclairage, et modèles de classification sur mesure pour des applications temps réel comme le tri rapide de pièces et la robotique de soudage 3D de précision.",
      },
      {
        name: "Ingénierie embarquée et systèmes",
        text: "Logiciels C++ et C# légers et économes en énergie, exécutés directement sur du matériel contraint (NPU, Jetson et microcontrôleurs spécialisés) pour des performances temps réel prévisibles.",
      },
      {
        name: "IA agentique et intégrations MCP",
        text: "Serveurs Model Context Protocol sécurisés qui relient assistants IA, outils de diagnostic RAG et équipements locaux, avec une validation humaine là où elle compte et sans compromettre votre propriété intellectuelle ni l’autonomie de votre réseau.",
      },
      {
        name: "Cloud hybride et pipelines de livraison",
        text: "Architecture cloud de niveau entreprise décrite en code avec Terraform, services conteneurisés sur Kubernetes et AWS, et intégration continue avec étapes de validation.",
      },
      {
        name: "Audits de qualité du code",
        text: "Analyse statique et contrôles de tests stricts pour les dépôts C++, Python et TypeScript, mis en place et réglés pour votre code afin qu’il reste prêt pour l’audit.",
      },
    ],
    advantageTitle: "Avantage stratégique",
    advantages: [
      {
        name: "100 % autonome sur l’appareil",
        text: "Aucune dépendance à une connexion Internet permanente : les machines industrielles critiques continuent de fonctionner de manière fiable pendant les coupures réseau.",
      },
      {
        name: "Ingénierie clé en main",
        text: "Un accompagnement sur tout le cycle de vie, du déploiement de modèles quantifiés et de l’optimisation matérielle jusqu’à un code prêt pour l’audit.",
      },
    ],
    cta: "Parler de votre projet",
  },
  projects: {
    title: "Projets",
    description:
      "Les projets de Kaar Smart Techs en vision par ordinateur, systèmes embarqués, cloud et DevOps, et outils agentiques.",
    lead: "Ce que nous construisons, avec un statut honnête pour chaque projet. Les résultats sont publiés une fois mesurés.",
    filterLabel: "Filtrer les projets par catégorie",
    all: "Tous",
    countOne: "{n} projet",
    countMany: "{n} projets",
  },
  project: {
    status: "Statut",
    categories: "Catégories",
    builtWith: "Technologies",
    builtWithList: "Technologies : {list}",
    problem: "Le problème",
    results: "Résultats",
    resultsNote:
      "Nous ne publions que des valeurs mesurées. Les valeurs manquantes sont en cours de mesure.",
    measuring: "En cours de mesure",
    next: "Parlez-nous d’un projet similaire",
  },
  contact: {
    title: "Contact",
    description: "Contacter Kaar Smart Techs à Delmenhorst, en Allemagne.",
    lead: "Décrivez ce que vous souhaitez détecter, trier ou automatiser, et à quelle échéance environ. Nous répondons sous deux jours ouvrés.",
    email: "Écrire à {email}",
    place: "Delmenhorst, Basse-Saxe, Allemagne",
  },
  impressum: {
    title: "Mentions légales",
    description: "Mentions légales (Impressum) de Kaar Smart Techs.",
    info: "Informations selon le § 5 DDG (loi allemande)",
    address: ["[Forme juridique]", "[Rue et numéro]", "[Code postal] Delmenhorst", "Allemagne"],
    represented: "Représenté par",
    representedValue: "[Nom du propriétaire ou du gérant]",
    contact: "Contact",
    email: "E-mail : {email}",
    phone: "Téléphone : {phone}",
    phoneValue: "[Numéro de téléphone]",
    register: "Immatriculation",
    registerValue: "[Tribunal et numéro d’immatriculation, si inscrit au Handelsregister]",
    vat: "Numéro de TVA",
    vatValue: "[USt-IdNr. selon le § 27a UStG, le cas échéant]",
  },
  privacy: {
    title: "Protection des données",
    description: "Politique de protection des données (Datenschutzerklärung) de Kaar Smart Techs.",
    intro:
      "Ce site ne dépose aucun cookie, n’utilise aucun outil d’analyse et ne charge aucun contenu provenant de tiers. Les polices sont servies depuis notre propre serveur.",
    controller: "Responsable du traitement",
    controllerText:
      "Kaar Smart Techs, [adresse], Delmenhorst, Allemagne. E-mail : hello@kaarsmarttechs.com",
    logs: "Journaux du serveur",
    logsText:
      "Notre hébergeur [nom, lieu] traite l’adresse IP, l’heure et la page demandée afin de fournir le site et d’en assurer la sécurité (art. 6, par. 1, point f du RGPD). Les journaux sont supprimés après [n] jours.",
    email: "Contact par e-mail",
    emailText:
      "Lorsque vous nous écrivez, nous traitons votre message pour y répondre (art. 6, par. 1, point b du RGPD) et le supprimons dès qu’il n’est plus nécessaire, sauf obligation légale de conservation.",
    rights: "Vos droits",
    rightsText:
      "Vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation du traitement, de portabilité et d’opposition, ainsi que du droit d’introduire une réclamation auprès d’une autorité de contrôle, par exemple la Landesbeauftragte für den Datenschutz Niedersachsen.",
  },
} satisfies typeof en;
