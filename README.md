# **Langie – AI-Powered Workflow Orchestrator**

**Langie** (Lang Graph Agent) is a powerful, graph-based workflow engine tailored for customer support automation. It visualizes and manages multi-step ticket processing, seamlessly carrying queries through stages—either sequentially or dynamically based on context.

---

## Why This Project Matters

* Transforms complex support flows into a visual, reliable pipeline
* Combines structured logic with AI-driven adaptability
* Designed for real-world readiness: responsive UI, error correction, and seamless integration

---

## Key Skills & Technologies

| Area                      | Tools & Approach                                                      |
| ------------------------- | --------------------------------------------------------------------- |
| **Modern Frontend Stack** | Vite, React (TypeScript), Tailwind CSS — for modular, performant UI   |
| **Component Design**      | Opinionated shadcn‑ui layouts enhance consistency and aesthetics      |
| **Workflow Modeling**     | Graph‑based orchestration across 11 stages—from INTAKE to COMPLETE    |
| **Execution Flexibility** | Supports both deterministic and conditional (non‑deterministic) paths |
| **State Management**      | Persists process status across stages for resilience and debugging    |
| **Integration Layer**     | Connects with MCP’s Atlas and Common servers for robust backend logic |
| **UX & Reliability**      | Real-time visualization, control actions (Start/Step/Reset), and logs |

---

## Workflow Stages in Action

Langie drives support ticket execution through well‑defined phases:

1. **INTAKE** – Captures incoming customer message
2. **UNDERSTAND** – Parses and extracts meaningful intent/data
3. **PREPARE** – Applies normalization, enrichment, risk tagging
4. **ASK** – Queries the user for clarification
5. **WAIT** – Pauses for human response
6. **RETRIEVE** – Fetches context or knowledge base references
7. **DECIDE** – Determines next steps or escalates
8. **UPDATE** – Alters ticket state or adds metadata
9. **CREATE** – Drafts reply or system notification
10. **DO** – Executes API calls or actions triggered by logic
11. **COMPLETE** – Finalizes and outputs structured data or response

---

## Getting Started

### Prerequisites

* Node.js (v18 or higher)
* npm or yarn for package management

### Run Locally

```bash
git clone https://github.com/TharunMopada/Langie.git
cd Langie
npm install        # or yarn install
npm run dev        # or yarn dev
```

Once running, enter a customer query in the UI and follow the execution through all workflow stages—complete with visual tracking, logs, and state data.

---

## Live Demo

Access a working demo here: [langie.vercel.app](https://langie.vercel.app)

---

## Why I'm Proud of This Project

* Designed a **graph‑oriented orchestration framework** for complex customer support flows
* Used **modern frontend architecture** (TypeScript, Vite, React, Tailwind) to deliver polished UX
* Enabled **flexible logic paths** (always‑on vs. conditional flows) for robust real‑world handling
* Built interactive visualization and control tooling for clarity and debugging efficiency

---

## Future Enhancements

* Add custom stage editors for more flexible flow creation
* Expand integrations with third-party APIs and knowledge bases
* Provide sample datasets and demo queries for onboarding
* Include automated testing and CI/CD pipeline setup

---

## License

This project is licensed under the **MIT License** – feel free to use and adapt.
