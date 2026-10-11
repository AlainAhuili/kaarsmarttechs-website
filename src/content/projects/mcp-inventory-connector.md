---
title: MCP Inventory Connector
tagline: Lets AI assistants check the sorted-brick inventory and start sort runs in plain language.
status: In development
categories: ["AI & Agentic Tooling"]
order: 4
problem: Inventory data locked inside a dashboard is slow to query when you just need to know whether a set is complete.
stack: ["Model Context Protocol", "Python", "TypeScript", "PostgreSQL"]
---

The connector is a Model Context Protocol server on top of the sorter's backend API. An assistant can answer questions like "how many red 2x4 bricks are in stock?" or "which parts is this set still missing?", and can pause or start a sort run with the operator's confirmation.
