import type en from "./en";

// Deutsche Texte, gleiche Schlüssel wie en.ts.
export default {
  meta: { name: "Deutsch", short: "DE", ogLocale: "de_DE" },
  nav: {
    home: "Kaar Smart Techs, Startseite",
    projects: "Projekte",
    services: "Leistungen",
    about: "Über uns",
    cta: "Kontakt aufnehmen",
    menu: "Menü",
    main: "Hauptnavigation",
    skip: "Zum Inhalt springen",
    language: "Sprache",
  },
  footer: {
    blurb: "Vision-, Embedded- und Cloud-Systeme.",
    place: "Delmenhorst, Deutschland",
    legal: "Rechtliches",
    impressum: "Impressum",
    privacy: "Datenschutz",
    contact: "Kontakt",
    lego: "LEGO® ist eine Marke der LEGO Gruppe, die diese Website weder sponsert noch autorisiert oder unterstützt.",
  },
  status: {
    "In development": "In Entwicklung",
    Internal: "Intern",
    "Client work": "Kundenprojekt",
  },
  categories: {
    "Computer Vision": "Computer Vision",
    "Embedded Systems": "Embedded-Systeme",
    "Cloud & DevOps": "Cloud & DevOps",
    "AI & Agentic Tooling": "KI & Agenten-Tools",
    "Code Quality": "Codequalität",
  },
  sorter: {
    title:
      "Ein Förderband trägt farbige Steine an einer Kamera vorbei, und jeder Stein wird in die Kiste seiner Farbe geschoben.",
    bins: ["Vision", "Embedded", "Cloud"],
  },
  home: {
    description:
      "Kaar Smart Techs verbindet Software und Hardware mit Edge AI, Embedded-Systemen und robuster Cloud-Infrastruktur. Mit Sitz in Delmenhorst.",
    badge: "Edge AI, Embedded-Systeme und Cloud-Infrastruktur",
    intro:
      "Wir verbinden leistungsstarke Software mit Hardware. Weil wir Daten direkt dort verarbeiten, wo Maschinen und Sensoren arbeiten, entfällt die Cloud-Latenz, Infrastrukturkosten sinken, und Sie erhalten höchste Zuverlässigkeit ohne Abstriche bei der Datensicherheit.",
    explore: "Kompetenzen entdecken",
    partner: "Zusammenarbeit anfragen",
    stats: [
      { value: "Edge AI", label: "Verarbeitung direkt an der Maschine" },
      { value: "100 %", label: "Autonom auf dem Gerät" },
      { value: "NPU · Jetson", label: "Embedded-Plattformen" },
      { value: "Deutschland", label: "Standort Delmenhorst" },
    ],
    capabilitiesEyebrow: "Unsere technischen Säulen",
    capabilitiesTitle: "Vom Sensor bis in die Cloud",
    capabilitiesText:
      "Vier Disziplinen aus einem Team, damit Bildverarbeitung, Embedded-Code, KI-Werkzeuge und Infrastruktur vom ersten Tag an zusammenpassen.",
    capabilities: [
      {
        name: "Bildverarbeitung und Inspektion",
        text: "OpenCV-Pipelines mit geringer Latenz, Kamera-Setups und eigene Klassifikationsmodelle für Echtzeitaufgaben wie schnelle Teilesortierung und präzise 3D-Schweißrobotik.",
      },
      {
        name: "Embedded- und Systementwicklung",
        text: "Schlanke, energieeffiziente Software in C++ und C#, die direkt auf ressourcenarmer Hardware (NPU, Jetson und spezielle Mikrocontroller) läuft, für planbare Echtzeitleistung.",
      },
      {
        name: "Agentische KI und MCP-Integrationen",
        text: "Sichere Model-Context-Protocol-Server, die KI-Assistenten, RAG-Diagnosewerkzeuge und Ihre Anlagen vor Ort verbinden, ohne Ihr geistiges Eigentum oder die Autonomie Ihres Netzwerks zu gefährden.",
      },
      {
        name: "Hybrid Cloud und Delivery-Pipelines",
        text: "Cloud-Architektur auf Unternehmensniveau mit Terraform, Kubernetes und AWS sowie Continuous Integration mit strengen Qualitätsprüfungen.",
      },
    ],
    howWeWork: "So arbeiten wir mit Ihnen",
    portfolioEyebrow: "Unser Kernportfolio",
    portfolioTitle: "Wo Software auf Hardware trifft",
    portfolioText:
      "Woran wir arbeiten, von kameragestützter Sortierung und Embedded-Inspektion bis zu smarten Alltagsprodukten und Solarinstallationen, jeweils mit ehrlichem Projektstatus.",
    featured: {
      "lego-sorting-system": {
        tag: "Automatisierung & KI",
        highlights: [
          "Bilderkennung in Echtzeit mit Bounding Boxes",
          "Mechanisches Förderband und Sortierzuführung",
          "Eigene Mikrocontroller- und Motorintegration",
        ],
      },
      "travel-hygienic-wc-seat-frame": {
        tag: "Smart Health & Alltag",
        highlights: [
          "Kompakte Klappkonstruktion für unterwegs",
          "Berührungsloses UV-C-Desinfektionsmodul",
          "Leichter Metallrahmen",
        ],
      },
      "solar-led-wireframe-sculptures": {
        tag: "Nachhaltige Kunst & Technik",
        highlights: [
          "Miniatur-Solarzellen",
          "Wetterfeste geschweißte Drahtskulpturen",
          "Beleuchtung von der Dämmerung bis zum Morgen",
        ],
      },
      "embedded-vision-toolkit": {
        tag: "Embedded Vision",
        highlights: [
          "Kameraerfassung und Lichtausgleich",
          "Segmentierung und Inferenz auf dem Gerät",
          "Wiederverwendbare C++-Module mit stabiler Schnittstelle",
        ],
      },
    },
    statusLabel: "Status: {status}",
    caseStudy: "Fallstudie",
    seeAll: "Alle Projekte ansehen",
    aboutEyebrow: "Über Kaar Smart Techs",
    aboutTitle: "Verwurzelt in Delmenhorst, Technik für die Welt",
    aboutP1Before:
      "Kaar Smart Techs verbindet leistungsstarke Software mit Hardware durch Verarbeitung vor Ort (Edge AI), Embedded-Systeme und robuste Cloud-Infrastruktur. Von",
    aboutPlace: "Delmenhorst in Niedersachsen",
    aboutP1After:
      " aus verbinden wir deutsche Ingenieursdisziplin mit kreativem, zukunftssicherem Design.",
    aboutP2:
      "Ob automatische Sortiermaschinen, kamerageführte Robotik oder sichere KI-Integrationen: Unser Anspruch bleibt derselbe:",
    advantage: "Strategischer Vorteil",
    pillars: [
      {
        name: "100 % autonom auf dem Gerät",
        text: "Keine Abhängigkeit von einer ständigen Internetverbindung, damit kritische Maschinen auch bei Netzausfällen weiterlaufen.",
      },
      {
        name: "Engineering aus einer Hand",
        text: "Begleitung über den gesamten Lebenszyklus, von der Bereitstellung quantisierter Modelle und der Hardwareoptimierung bis zu prüfbereiten Codebasen.",
      },
    ],
    missionTitle: "Mission und Mehrwert",
    values: [
      {
        name: "Keine Cloud-Latenz",
        text: "Daten werden dort verarbeitet, wo Maschinen und Sensoren arbeiten, sodass Entscheidungen in Echtzeit fallen.",
      },
      {
        name: "Geringere Infrastrukturkosten",
        text: "Weniger Daten, die in die Cloud übertragen und dort gespeichert werden, bedeuten niedrigere Rechnungen und einfachere Infrastruktur.",
      },
      {
        name: "Zuverlässigkeit ohne Kompromisse",
        text: "Höchste Betriebssicherheit, und sensible Produktionsdaten bleiben vor Ort.",
      },
    ],
    contactEyebrow: "Kontakt",
    contactTitle: "Lassen Sie uns gemeinsam die Zukunft bauen",
    contactText:
      "Sie haben eine Projektanfrage, eine Idee für eine Zusammenarbeit oder möchten unsere Technologien kennenlernen? Schreiben Sie unserem Team in Delmenhorst.",
    hq: "Firmensitz",
    hqLines: ["Delmenhorst, Niedersachsen", "Deutschland"],
    emailUs: "E-Mail an uns",
    responseTitle: "Antwortzeit",
    responseText: "Wir antworten innerhalb von zwei Werktagen.",
    panelTitle: "Erzählen Sie uns von Ihrem Projekt",
    panelText:
      "Beschreiben Sie, was Sie erkennen, sortieren oder automatisieren möchten und bis wann ungefähr. Wir melden uns mit den nächsten Schritten.",
    send: "Nachricht senden",
  },
  services: {
    title: "Leistungen",
    description:
      "Engineering-Leistungen von Kaar Smart Techs: Edge-AI-Bildverarbeitung, Embedded-Software, MCP-Integrationen, Hybrid-Cloud-Pipelines und Codequalitäts-Audits.",
    lead: "Wir verbinden leistungsstarke Software mit Hardware. Weil wir Daten direkt dort verarbeiten, wo Maschinen und Sensoren arbeiten, entfällt die Cloud-Latenz, Infrastrukturkosten sinken, und Ihre Daten bleiben bei Ihnen.",
    items: [
      {
        name: "Bildverarbeitung und Inspektion",
        text: "OpenCV-Pipelines mit geringer Latenz, Kamera- und Lichtaufbau sowie eigene Klassifikationsmodelle für Echtzeitanwendungen wie schnelle Teilesortierung und präzise 3D-Schweißrobotik.",
      },
      {
        name: "Embedded- und Systementwicklung",
        text: "Schlanke, energieeffiziente Software in C++ und C#, die direkt auf ressourcenarmer Hardware (NPU, Jetson und spezielle Mikrocontroller) läuft, für planbare Echtzeitleistung.",
      },
      {
        name: "Agentische KI und MCP-Integrationen",
        text: "Sichere Model-Context-Protocol-Server, die KI-Assistenten, RAG-Diagnosewerkzeuge und Ihre Anlagen vor Ort verbinden, mit menschlicher Bestätigung an den entscheidenden Stellen und ohne Ihr geistiges Eigentum oder die Autonomie Ihres Netzwerks zu gefährden.",
      },
      {
        name: "Hybrid Cloud und Delivery-Pipelines",
        text: "Cloud-Architektur auf Unternehmensniveau als Code mit Terraform, containerisierte Dienste auf Kubernetes und AWS sowie Continuous Integration mit Freigabestufen.",
      },
      {
        name: "Codequalitäts-Audits",
        text: "Statische Analyse und strenge Testprüfungen für C++-, Python- und TypeScript-Repositories, eingerichtet und abgestimmt auf Ihre Codebasis, damit sie jederzeit prüfbereit bleibt.",
      },
    ],
    advantageTitle: "Strategischer Vorteil",
    advantages: [
      {
        name: "100 % autonom auf dem Gerät",
        text: "Keine Abhängigkeit von einer ständigen Internetverbindung, damit kritische Industrieanlagen auch bei Netzausfällen zuverlässig weiterlaufen.",
      },
      {
        name: "Engineering aus einer Hand",
        text: "Begleitung über den gesamten Lebenszyklus, von der Bereitstellung quantisierter Modelle und der Hardwareoptimierung bis zu prüfbereiten Codebasen.",
      },
    ],
    cta: "Projekt besprechen",
  },
  projects: {
    title: "Projekte",
    description:
      "Projekte von Kaar Smart Techs in Computer Vision, Embedded-Systemen, Cloud & DevOps und KI-Agenten-Tools.",
    lead: "Woran wir arbeiten, jeweils mit ehrlichem Projektstatus. Ergebnisse veröffentlichen wir, sobald sie gemessen sind.",
    filterLabel: "Projekte nach Kategorie filtern",
    all: "Alle",
    countOne: "{n} Projekt",
    countMany: "{n} Projekte",
  },
  project: {
    status: "Status",
    categories: "Kategorien",
    builtWith: "Technologien",
    builtWithList: "Technologien: {list}",
    problem: "Die Herausforderung",
    results: "Ergebnisse",
    resultsNote: "Wir veröffentlichen nur gemessene Werte. Offene Werte werden noch gemessen.",
    measuring: "Wird gemessen",
    next: "Sprechen Sie uns auf ein ähnliches Projekt an",
  },
  contact: {
    title: "Kontakt",
    description: "Kontakt zu Kaar Smart Techs in Delmenhorst.",
    lead: "Beschreiben Sie, was Sie erkennen, sortieren oder automatisieren möchten und bis wann ungefähr. Wir antworten innerhalb von zwei Werktagen.",
    email: "E-Mail an {email}",
    place: "Delmenhorst, Niedersachsen, Deutschland",
  },
  impressum: {
    title: "Impressum",
    description: "Impressum von Kaar Smart Techs.",
    info: "Angaben gemäß § 5 DDG",
    address: ["[Rechtsform]", "[Straße und Hausnummer]", "[PLZ] Delmenhorst", "Deutschland"],
    represented: "Vertreten durch",
    representedValue: "[Name des Inhabers oder Geschäftsführers]",
    contact: "Kontakt",
    email: "E-Mail: {email}",
    phone: "Telefon: {phone}",
    phoneValue: "[Telefonnummer]",
    register: "Registereintrag",
    registerValue: "[Registergericht und Registernummer, falls im Handelsregister eingetragen]",
    vat: "Umsatzsteuer-ID",
    vatValue: "[USt-IdNr. gemäß § 27a UStG, falls vorhanden]",
  },
  privacy: {
    title: "Datenschutzerklärung",
    description: "Datenschutzerklärung von Kaar Smart Techs.",
    intro:
      "Diese Website setzt keine Cookies, nutzt keine Analysewerkzeuge und lädt keine Inhalte von Dritten. Schriften werden von unserem eigenen Server ausgeliefert.",
    controller: "Verantwortlicher",
    controllerText:
      "Kaar Smart Techs, [Anschrift], Delmenhorst, Deutschland. E-Mail: hello@kaarsmarttechs.com",
    logs: "Server-Logdateien",
    logsText:
      "Unser Hosting-Anbieter [Name, Standort] verarbeitet IP-Adresse, Zeitpunkt und aufgerufene Seite, um die Website auszuliefern und abzusichern (Art. 6 Abs. 1 lit. f DSGVO). Die Logdateien werden nach [n] Tagen gelöscht.",
    email: "Kontakt per E-Mail",
    emailText:
      "Wenn Sie uns eine E-Mail schreiben, verarbeiten wir Ihre Nachricht, um sie zu beantworten (Art. 6 Abs. 1 lit. b DSGVO), und löschen sie, sobald sie nicht mehr benötigt wird, sofern keine gesetzlichen Aufbewahrungsfristen bestehen.",
    rights: "Ihre Rechte",
    rightsText:
      "Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch sowie das Recht, sich bei einer Aufsichtsbehörde zu beschweren, etwa bei der Landesbeauftragten für den Datenschutz Niedersachsen.",
  },
} satisfies typeof en;
