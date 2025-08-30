Langie – Lang Graph Agent

🚀 Customer Support Workflow Orchestrator built with graph-based stage modeling.

Langie is an AI-powered workflow orchestrator that manages customer support tickets step by step.
It models customer queries as a graph with 11 workflow stages (INTAKE → COMPLETE), supporting deterministic and non-deterministic execution, state persistence, and MCP client integration.

🛠️ Technologies Used

This project is built with:

⚡ Vite – fast frontend tooling

🟦 TypeScript – strong typing for reliability

⚛️ React – component-based UI

🎨 Tailwind CSS – modern utility-first styling

🧩 shadcn-ui – elegant, reusable UI components

📊 Features

Graph Orchestration with 11 customer support stages

Deterministic & Non-deterministic Execution (sequential or dynamic ability selection)

State Persistence across all workflow stages

MCP Client Integration (Atlas & Common servers)

Error Handling & Escalation Management

Real-time Workflow Visualization with execution tracking

Interactive Controls (Start, Step, Reset, Scenario Selection)

🔄 Workflow Stages

INTAKE 📥 – Accept customer payload

UNDERSTAND 🧠 – Parse request, extract entities

PREPARE 🛠️ – Normalize fields, enrich records, add risk flags

ASK ❓ – Request clarification from customer

WAIT ⏳ – Process human response

RETRIEVE 📚 – Search knowledge base

DECIDE ⚖️ – Evaluate solutions, escalate if needed

UPDATE 🔄 – Update ticket fields/status

CREATE ✍️ – Draft customer response

DO 🏃 – Execute API calls, send notifications

COMPLETE ✅ – Output final structured payload

📸 Screenshots
Workflow Dashboard
<img width="1833" height="933" alt="Screenshot 2025-08-30 113725" src="https://github.com/user-attachments/assets/e2803057-092c-4b0c-bb12-369965bc8943" />
<img width="1332" height="865" alt="Screenshot 2025-08-30 101940" src="https://github.com/user-attachments/assets/e6dc5e5d-eacc-42b7-ba47-671d1bce4b50" />
<img width="763" height="874" alt="Screenshot 2025-08-30 113849" src="https://github.com/user-attachments/assets/a11025dc-4d26-415c-97b6-b2f243918c56" />
<img width="387" height="892" alt="Screenshot 2025-08-30 113918" src="https://github.com/user-attachments/assets/f82841fb-4aff-4fce-bed8-2ac303792b71" />
<img width="397" height="921" alt="Screenshot 2025-08-30 113940" src="https://github.com/user-attachments/assets/0404dbf4-02f0-4880-9b35-43474db63553" />
<img width="1677" height="611" alt="Screenshot 2025-08-30 113954" src="https://github.com/user-attachments/assets/04dcf0da-0839-49ef-8518-c908c5fc7c66" />
<img width="1187" height="928" alt="Screenshot 2025-08-30 114018" src="https://github.com/user-attachments/assets/08e0557a-6fef-4518-97b8-fd06ecc574e6" />

🚀 Getting Started
Prerequisites

Node.js (>= 18)

npm or yarn

Installation
# Clone repo
git clone https://github.com/your-username/lang-graph-agent.git
cd lang-graph-agent

# Install dependencies
npm install

# Start development server
npm run dev

🎯 Demo Run

Enter a customer query in the input form

Follow the workflow execution (deterministic + non-deterministic stages)

View logs, state variables, and final structured payload
