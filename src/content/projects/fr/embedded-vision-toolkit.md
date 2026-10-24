---
title: Boîte à outils de vision embarquée
tagline: Des modules C++ réutilisables pour la capture caméra, la segmentation et l’inférence sur l’appareil.
status: Internal
categories: ["Computer Vision", "Embedded Systems"]
order: 2
problem: Les tâches d’inspection industrielle comme le comptage de pièces ou la détection de défauts refont le même travail de vision de bas niveau sur chaque nouvel appareil.
stack: ["C++", "OpenCV", "Embedded Linux", "CMake"]
---

La boîte à outils est issue du logiciel embarqué du trieur LEGO. Elle regroupe la capture d’images, la normalisation de l’éclairage, la segmentation et l’inférence de modèles en petits modules à l’interface stable, pour qu’un nouveau projet d’inspection démarre avec du code testé plutôt qu’avec un fichier vide.
