---
title: Connecteur d’inventaire MCP
tagline: Permet aux assistants IA de consulter l’inventaire des briques triées et de lancer des cycles de tri en langage naturel.
status: In development
categories: ["AI & Agentic Tooling"]
order: 4
problem: Des données d’inventaire enfermées dans un tableau de bord sont lentes à interroger quand on veut simplement savoir si un set est complet.
stack: ["Model Context Protocol", "Python", "TypeScript", "PostgreSQL"]
---

Le connecteur est un serveur Model Context Protocol branché sur l’API du trieur. Un assistant peut répondre à des questions comme « Combien de briques rouges 2x4 sont en stock ? » ou « Quelles pièces manquent encore à ce set ? », et peut mettre en pause ou lancer un cycle de tri avec la confirmation de l’opérateur.
