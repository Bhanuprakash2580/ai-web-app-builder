# 🚀 NxtBuild - AI-Powered Web App Builder

NxtBuild is a cutting-edge, AI-powered web app generator. It allows users to instantly build dynamic, production-ready web applications simply by describing them in natural language. Powered by **Google's Gemini 2.5 Flash AI**, a robust Express backend, and a brilliant React Vite frontend matching industry-level premium dark IDE aesthetics.

## 📸 Screenshots

### Landing Page
![Landing Page](./screenshots/landing.png)

### Split-Layout Login
![Login Page](./screenshots/login.png)

## ✨ Core Features
- **Prompt-to-App:** Formulate an idea in plain English and let NxtBuild handle the entire HTML + CSS scaffold.
- **Dual-Pane IDE Layout:** A specialized fluid workspace featuring a responsive chat sidebar and a sprawling live-rendering workspace.
- **Live Sandbox Preview:** See code executing flawlessly inside a safe `srcDoc` iframe alongside a dedicated `<Code />` viewer tab.
- **Instant Export:** Download your generated source code straight from the Dashboard or Builder with a single click.
- **Secure Authentication:** Mongoose + JWT flow supporting seamless user saving and auto-token interception.

## 🛠️ The Tech Stack
- **Frontend:** React, Vite, React Router DOM
- **Backend:** Node.js, Express, MongoDB (Mongoose), JSON Web Tokens
- **AI Engine:** Google Gemini SDK (`@google/generative-ai`) executing `gemini-2.5-flash` natively.

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- A **[Google AI Studio API Key](https://aistudio.google.com/app/apikey)** (Ensure the project created enables the Generative Language API)
- A **MongoDB** connection string

### 2. Installation
Clone the repository recursively:
```bash
git clone https://github.com/Bhanuprakash2580/ai-web-app-builder.git
cd ai-web-app-builder
```

**Install Backend Dependencies:**
```bash
cd server
npm install
```

**Install Frontend Dependencies:**
```bash
cd ../client
npm install
```

### 3. Environment Variables
Inside the `server` directory, configure your `.env` file (see `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/nxtbuild
JWT_SECRET=supersecret123
GEMINI_API_KEY=AIzaSy...
CLIENT_URL=http://localhost:5173
```

### 4. Boot Up!
Our custom unified package script spins everything up instantly. From the **root** folder:
```bash
npm run dev
```

Navigate to `http://localhost:5173` to start building!
