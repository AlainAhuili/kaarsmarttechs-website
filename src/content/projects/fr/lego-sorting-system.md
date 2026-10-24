---
title: Système de tri LEGO automatisé
tagline: Une machine qui voit, classe et trie les briques en vrac pour transformer un tas mélangé en un inventaire organisé.
status: In development
categories: ["Computer Vision", "Embedded Systems", "Cloud & DevOps"]
flagship: true
order: 1
problem: Collectionneurs, revendeurs et enseignants manipulent des milliers de briques en vrac. Les trier à la main par pièce et par couleur prend des heures, et les erreurs sont fréquentes.
stack: ["C++", "OpenCV", "Python", "PostgreSQL", "TypeScript", "Docker", "Terraform", "AWS"]
metrics:
  - label: Briques par minute
  - label: Précision de classification
  - label: Types de pièces reconnus
  - label: Bacs de sortie
videos:
  - src: /videos/lego-sorter-concept-1.mp4
    poster: /videos/lego-sorter-concept-1.jpg
    caption: "Konzeptanimation (KI-generiert): un collecteur mobile ramasse les briques en vrac, la caméra analyse chacune d’elles et un bras robotisé les range dans des bacs."
  - src: /videos/lego-sorter-concept-2.mp4
    poster: /videos/lego-sorter-concept-2.jpg
    caption: "Konzeptanimation (KI-generiert): les briques avancent sur le convoyeur sous la caméra, sont reconnues sur l’écran et tombent dans les bacs selon leur couleur."
---

## Fonctionnement

Une trémie et un alimentateur vibrant séparent les briques pour qu’elles passent une à une devant la caméra. Un pipeline OpenCV en C++ sur une carte embarquée segmente chaque brique, un classificateur identifie sa référence et sa couleur, et un jet d’air la pousse dans le bon bac.

Chaque pièce triée est enregistrée dans un inventaire cloud. Les opérateurs suivent en direct le débit et le remplissage des bacs dans un tableau de bord web, et vérifient les classifications peu sûres, qui alimentent le cycle d’entraînement suivant.

## Composants du système

- **Manutention mécanique :** trémie, alimentateur vibrant, convoyeur et éjecteurs pilotés par le contrôleur.
- **Vision embarquée :** capture en temps réel, soustraction d’arrière-plan, segmentation et inférence en C++.
- **Entraînement des modèles :** constitution des jeux de données et entraînement en Python, exportés vers l’environnement d’exécution embarqué.
- **Backend et données :** API des cycles de tri, catalogue de pièces et inventaire dans PostgreSQL, images dans un stockage objet.
- **Tableau de bord opérateur :** débit et remplissage en direct, file de vérification et export de l’inventaire.
- **Infrastructure :** services conteneurisés, infrastructure as code et CI/CD pour les logiciels embarqués et cloud.
