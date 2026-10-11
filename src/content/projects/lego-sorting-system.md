---
title: Automated LEGO Sorting System
tagline: A machine that sees, classifies and sorts loose bricks, turning a mixed pile into an organised inventory.
status: In development
categories: ["Computer Vision", "Embedded Systems", "Cloud & DevOps"]
flagship: true
order: 1
problem: Collectors, resellers and educators handle thousands of loose bricks. Sorting them by part and colour by hand takes hours and mistakes are common.
stack: ["C++", "OpenCV", "Python", "PostgreSQL", "TypeScript", "Docker", "Terraform", "AWS"]
metrics:
  - label: Bricks per minute
  - label: Classification accuracy
  - label: Part types recognised
  - label: Output bins
---

## How it works

A hopper and vibration feeder separate bricks so they pass the camera one at a time. An OpenCV pipeline running in C++ on an embedded board segments each brick, a classifier identifies its part number and colour, and an air jet pushes it into the right bin.

Every sorted piece is logged to a cloud inventory. Operators follow throughput and bin levels live in a web dashboard and review low-confidence classifications, which feed the next training round.

## System components

- **Mechanical handling:** hopper, vibration feeder, conveyor and ejectors driven by the controller.
- **Edge vision:** real-time capture, background subtraction, segmentation and inference in C++.
- **Model training:** dataset building and training in Python, exported to the edge runtime.
- **Backend and data:** sort-run API, parts catalogue and inventory in PostgreSQL, images in object storage.
- **Operator dashboard:** live throughput, bin levels, review queue and inventory export.
- **Infrastructure:** containerised services, infrastructure as code and CI/CD for edge and cloud software.
