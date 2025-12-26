# 🤖 MASTERCHAT AI

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-grey?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

**MASTERCHAT AI** is a premium, high-performance intelligent chat application powered by Google's Gemini AI. Designed with a focus on modern UI/UX and seamless performance, it offers a sophisticated platform for AI-driven conversations.

---

## ✨ Key Features

-   **🧠 Advanced AI Core**: Real-time streaming responses powered by the Google Gemini API.
-   **🔐 Robust Authentication**: Dual-mode login system (Custom Email/Name & Google OAuth 2.0).
-   **🌓 Dynamic Theming**: Seamless transition between sophisticated Dark Mode and clean Light Mode, with persistence.
-   **📁 Smart Sidebar**: Effortless conversation management with persistent history and quick-action tools.
-   **🎨 Premium UI/UX**: 
    -   Responsive layout for mobile and desktop.
    -   Custom-engineered CSS animations for modals and dropdowns.
    -   Backdrop-blur effects and glassmorphism elements.
-   **⚡ High Performance**: Built on Vite for lightning-fast development and optimized production builds.

---

## 🛠️ Technology Stack

-   **Frontend**: React 18, TypeScript
-   **Styling**: Tailwind CSS
-   **Icons**: Lucide React
-   **AI SDK**: @google/genai
-   **OAuth**: @react-oauth/google
-   **Build Tool**: Vite

---

## 🚀 Quick Start

### Prerequisites

-   Node.js (v18 or higher)
-   Google Gemini API Key ([Get it here](https://aistudio.google.com/app/apikey))
-   Google OAuth Client ID ([Setup here](https://console.cloud.google.com/))

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/M4STERPIECE77K/MASTERCHATAI.git
    cd MASTERCHATAI
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure environment variables**:
    Create a `.env` file in the root directory:
    ```env
    VITE_API_KEY=your_gemini_api_key_here
    VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
    ```

4.  **Run in development**:
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5204`.

---

## 🏗️ Architecture

The project follows a modular and clean architecture:
-   `src/components`: Reusable UI components (Sidebar, ChatMessage, etc.)
-   `src/pages`: Main application views (Login, Home)
-   `src/services`: External API integrations (Gemini AI)
-   `src/types`: Centralized TypeScript interfaces

---

## 🔒 Security

-   Secrets are managed via `.env` (gitignored).
-   Logout confirmation modals prevent accidental session termination.
-   OAuth 2.0 standard implementation for secure user authentication.

---

## 👤 Author

**M4STERPIECE77K**

---

Developed for the future of AI interaction.
