---
title: Codequalitäts-Pipeline
tagline: Automatische statische Analyse und Testprüfungen für gemischten C++-, Python- und TypeScript-Code.
status: Internal
categories: ["Code Quality", "Cloud & DevOps"]
order: 5
problem: In Repositories mit mehreren Sprachen wird oft eine Sprache gründlich geprüft und der Rest gar nicht.
stack: ["clang-tidy", "cppcheck", "Ruff", "ESLint", "GitHub Actions"]
---

Eine wiederverwendbare Pipeline führt bei jedem Pull Request die passenden Analysewerkzeuge für jede Sprache aus und blockiert Merges, die neue Befunde einführen. Wir bieten sie als Leistung mit festem Umfang an: ein bestehendes Repository prüfen, dann die Prüfungen einrichten und abstimmen.
