---
title: Automatisches LEGO-Sortiersystem
tagline: Eine Maschine, die lose Steine erkennt, klassifiziert und sortiert und aus einem gemischten Haufen einen geordneten Bestand macht.
status: In development
categories: ["Computer Vision", "Embedded Systems", "Cloud & DevOps"]
flagship: true
order: 1
problem: Sammler, Händler und Lehrkräfte haben mit Tausenden loser Steine zu tun. Sie von Hand nach Teil und Farbe zu sortieren dauert Stunden, und Fehler sind häufig.
stack: ["C++", "OpenCV", "Python", "PostgreSQL", "TypeScript", "Docker", "Terraform", "AWS"]
metrics:
  - label: Steine pro Minute
  - label: Klassifikationsgenauigkeit
  - label: Erkannte Teiletypen
  - label: Ausgabekisten
videos:
  - src: /videos/lego-sorter-concept-1.mp4
    poster: /videos/lego-sorter-concept-1.jpg
    caption: "Konzeptanimation (KI-generiert): Ein mobiler Sammler nimmt lose Steine auf, die Kamera erfasst jeden einzelnen, und ein Roboterarm sortiert sie in Kisten."
  - src: /videos/lego-sorter-concept-2.mp4
    poster: /videos/lego-sorter-concept-2.jpg
    caption: "Konzeptanimation (KI-generiert): Steine laufen auf dem Förderband unter der Kamera durch, werden auf dem Display erkannt und landen nach Farbe sortiert in den Kisten."
---

## So funktioniert es

Ein Trichter und ein Vibrationsförderer vereinzeln die Steine, sodass sie nacheinander an der Kamera vorbeilaufen. Eine OpenCV-Pipeline in C++ auf einem Embedded-Board segmentiert jeden Stein, ein Klassifikator bestimmt Teilenummer und Farbe, und ein Luftstoß befördert ihn in die richtige Kiste.

Jedes sortierte Teil wird in einem Cloud-Bestand erfasst. Bediener verfolgen Durchsatz und Füllstände live in einem Web-Dashboard und prüfen unsichere Klassifizierungen, die in die nächste Trainingsrunde einfließen.

## Systemkomponenten

- **Mechanik:** Trichter, Vibrationsförderer, Förderband und Auswerfer, angesteuert vom Controller.
- **Edge Vision:** Bilderfassung in Echtzeit, Hintergrundsubtraktion, Segmentierung und Inferenz in C++.
- **Modelltraining:** Aufbau der Datensätze und Training in Python, exportiert für die Laufzeitumgebung auf dem Gerät.
- **Backend und Daten:** API für Sortierläufe, Teilekatalog und Bestand in PostgreSQL, Bilder im Objektspeicher.
- **Bediener-Dashboard:** Durchsatz und Füllstände live, Prüfwarteschlange und Bestandsexport.
- **Infrastruktur:** containerisierte Dienste, Infrastructure as Code und CI/CD für Edge- und Cloud-Software.
