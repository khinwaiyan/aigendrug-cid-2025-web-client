# User Manual for AIGENDRUG Web Client

## Introduction

Welcome to the **AIGENDRUG Web Client**! This platform provides an integrated web interface for interacting with AI tools developed for drug discovery and experimental optimization. It allows users to chat, receive tool recommendations, input data, and view tool results — all from a single, streamlined dashboard.

This guide will walk you through the setup, navigation, and usage of the frontend application.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Navigating the Application](#navigating-the-application)
   - [Dashboard](#dashboard)
   - [Session List Page](#session-list-page)
   - [Tool List & Register Page](#tool-list--register-page)
   - [Tool Recommendation Page](#tool-recommendation-page)
   - [Tool Input & Output Page](#tool-input--output-page)
3. [Using the Chat Feature](#using-the-chat-feature)
4. [Troubleshooting](#troubleshooting)
5. [Support](#support)

---

## Getting Started

### Prerequisites

To use this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **Yarn** package manager
- Git (optional, for version control)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/khinwaiyan/aigendrug-cid-2025-web-client.git
   cd aigendrug-cid-2025-web-client
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Start the development server:

   ```bash
   yarn dev
   ```

4. Open your browser and go to:

   ```
   http://localhost:3000
   ```

---

## Navigating the Application

### Dashboard

- Displays the number of currently active **sessions** and **registered tools**.
- From this page, you can:

  - View detailed session list
  - Add or delete sessions
  - Check each session’s name, status, and the ID of any tool running within it

- You can navigate to other parts of the app using the top **navigation bar**

---

### Session List Page

- Accessed from the sidebar or via the floating chat button (FAB)
- Allows users to:

  - View existing chat sessions
  - Start a **new session** for tool recommendation or chat
  - Continue previously created sessions

---

### Tool List & Register Page

- View all **registered tools** in a searchable, sortable table
- Each tool shows metadata including tool name, interface type, and expected input
- You can register new tools in the **Tool Register Page** via:

  - A manual JSON form
  - Uploading a `.json` file matching the expected schema

---

### Tool Recommendation Page

- Found inside the chat session screen
- Users can input natural language queries
  _e.g. “I want to find potential inhibitors for protein X”_
- The system recommends appropriate tools based on the input
- Click the **“Use Tool”** button next to a recommendation to go to the **Tool Input Page**

---

### Tool Input & Output Page

#### Tool Input Page

- Dynamically renders input forms based on tool specification
- Supported input types include:

  - Numeric fields
  - SMILES strings
  - CSV file upload

- After submitting the form:

  - The tool execution is triggered
  - You are redirected to the **Tool Session List Page**

#### Tool Session List Page

- Displays a list of all tool executions under the current session
- Shows:

  - Tool name
  - Execution status (`pending`, `running`, `success`, `failed`)
  - Creation timestamp

- You can filter the list by status
- Clicking on a successfully executed tool redirects to the **Tool Output Page**

#### Tool Output Page

- Shows the final results returned by the tool
- Output formats vary by tool and can include:

  - Tables
  - Images
  - Text summaries
  - Downloadable files

---

## Using the Chat Feature

- A **Floating Action Button (FAB)** with the AIGENDRUG logo is visible in the bottom-right of all pages
- Clicking it opens the **chat modal**
- Features include:

  - Viewing existing sessions
  - Starting a new session
  - Asking natural language queries to get tool recommendations

- Serves as the main entry point to the recommendation pipeline

---

## Troubleshooting

- **White screen on load**
  Ensure `.env` has the correct `VITE_API_BASE_URL` pointing to the backend server.

- **Tool list not loading**
  Confirm the backend is running and reachable from the frontend.

- **CORS errors in browser console**
  Backend server may be missing CORS headers. Enable them for the frontend origin.

- **Chat is not responding**
  Backend LLM pipeline or LangGraph service may be down. Restart or inspect logs.

---

## Support

For questions, bug reports, or further assistance, contact:

📧 [khinwaiyan@snu.ac.kr](mailto:khinwaiyan@snu.ac.kr)

---
