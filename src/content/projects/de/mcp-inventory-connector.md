---
title: MCP-Bestandsconnector
tagline: Lässt KI-Assistenten den Bestand sortierter Steine abfragen und Sortierläufe in natürlicher Sprache starten.
status: In development
categories: ["AI & Agentic Tooling"]
order: 4
problem: Bestandsdaten, die in einem Dashboard stecken, lassen sich nur mühsam abfragen, wenn man nur wissen will, ob ein Set vollständig ist.
stack: ["Model Context Protocol", "Python", "TypeScript", "PostgreSQL"]
---

Der Connector ist ein Model-Context-Protocol-Server auf der Backend-API des Sortierers. Ein Assistent kann Fragen wie „Wie viele rote 2x4-Steine sind auf Lager?“ oder „Welche Teile fehlen diesem Set noch?“ beantworten und mit Bestätigung des Bedieners einen Sortierlauf pausieren oder starten.
