# Slangify App — Transform Text into Modern Slang

![Slangify App](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwindcss&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![Seenode](https://img.shields.io/badge/Deployment-Seenode-blue)

Slangify App is a **Node.js + TypeScript web application** that converts normal text into modern slang automatically. It features a responsive UI, multi-word phrase translation, sentence capitalization, and a seamless CI/CD deployment pipeline with Seenode.

---

## Features
- **Text to Slang Translation** – Converts normal sentences to slang in real-time.
- **Multi-word Phrase Support** – Handles phrases like "going to", "kind of", "want to".
- **Sentence Capitalization** – Automatically capitalizes the first letter of sentences.
- **Responsive UI** – Built with TailwindCSS, looks great on all devices.
- **Frontend + Backend Separation** – Frontend built with TypeScript + Tailwind, backend with Node.js + Express.
- **Continuous Deployment** – Automated deployment to Seenode via GitHub Actions.
- **Health Check Endpoint** – Monitor backend status at `/health`.

---

## Tech Stack
- **Backend**: Node.js + Express.js  
- **Frontend**: TypeScript + TailwindCSS  
- **Database**: None required (local JSON dictionary used)  
- **CI/CD**: GitHub Actions  
- **Hosting/Deployment**: Seenode  
- **Data Source**: Local JSON dictionary (`slang-dictionary.json`)

---

## Quick Start

### Scripts Overview
```bash
npm run dev       # Starts frontend + backend for development
npm run build     # Builds frontend + backend for production
npm start         # Starts backend in production mode

Prerequisites
Node.js 18+
Git
GitHub account
Seenode account with API token

How It Works
Uses a local JSON slang dictionary (slang-dictionary.json)
Supports multi-word phrase matching (e.g., “going to” → “gonna”)
Normalizes text and applies sentence capitalization rules
Returns transformed slang text via REST API

Installation
Clone the repository

git clone https://github.com/nuelcas/slangify-app.git
cd slangify-app


Install root dependencies

Install backend dependencies
cd backend
npm install

Install frontend dependencies
cd frontend
npm install


Run in development
npm run dev


Opens frontend at http://localhost:5173

Backend API available at http://localhost:8080/api/slang

Production Build
npm run build
npm start

Repository Structure
/slangify-app
├── /frontend
│   ├── /src
│   │   ├── main.ts          # Frontend logic
│   │   └── styles.css       # Optional styles
│   ├── index.html
│   └── package.json
├── /backend
│   ├── src/main.ts           # Express server
│   ├── slang-dictionary.json
│   └── package.json
├── .github
│   └── workflows/deploy.yml  # GitHub Actions CI/CD workflow
└── README.md

API Endpoints
GET /api/slangify

Query parameter: text

Example: /api/slangify?text=I am going to be back

Response:

{
  "input": "I am going to be back",
  "output": "I am gonna be back"
}

POST /api/slangify

Body parameter: text

Example:

{
  "text": "I want to see you tomorrow"
}


Response:

{
  "input": "I want to see you tomorrow",
  "output": "I wanna see you tmrw"
}

GET /health

Returns backend status

{ "status": "ok" }

Continuous Deployment with Seenode

GitHub Actions Workflow: .github/workflows/deploy.yml

Trigger: On push to main branch

Workflow Steps:
Checkout code

Setup Node.js

Install backend & frontend dependencies

Build frontend

Deploy to Seenode

Deployment Instructions:

Add SEENODE_APPLICATION_ID and SEENODE_API_TOKEN as GitHub Secrets

Push to main branch

Workflow triggers automatic deployment to Seenode

Example workflow snippet:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm install
      - run: cd frontend && npm install && npm run build
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: seenode/action-deploy@v1
        with:
          app-name: slangify-app
          token: ${{ secrets.SEENODE_API_TOKEN }}


Contributing
We welcome contributions!
Fork the repository
Create a feature branch: git checkout -b feat/your-feature
Make changes, run tests locally
Submit a pull request

License
This project is licensed under the MIT License — see LICENSE for details.