---
title: Pipeline de qualité du code
tagline: Analyse statique et contrôles de tests automatisés pour du code mêlant C++, Python et TypeScript.
status: Internal
categories: ["Code Quality", "Cloud & DevOps"]
order: 5
problem: Les dépôts qui mélangent plusieurs langages vérifient souvent bien l’un d’eux et laissent les autres sans contrôle.
stack: ["clang-tidy", "cppcheck", "Ruff", "ESLint", "GitHub Actions"]
---

Un pipeline réutilisable lance les bons analyseurs pour chaque langage à chaque pull request et bloque les fusions qui introduisent de nouveaux problèmes. Il est proposé comme un service au périmètre défini : audit d’un dépôt existant, puis mise en place et réglage des contrôles.
