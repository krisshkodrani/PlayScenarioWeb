# PlayScenarioAI

PlayScenarioAI is a web-based platform for creating and playing through interactive, AI-driven scenarios. It's designed for a wide range of applications, from professional training and development to entertainment and creative storytelling.

## Key Features

*   **Interactive Scenarios:** Engage in dynamic conversations with AI characters that react to your choices.
*   **Multi-Character Interaction:** Scenarios can feature multiple AI characters, each with their own distinct personality and goals.
*   **Scenario and Character Creation:** Users can create their own scenarios and characters, allowing for a high degree of customization and creativity.
*   **User Management:** The platform includes a robust user management system, with support for admin roles and content moderation.
*   **Credit-Based System:** The application uses a credit-based system for accessing scenarios, with a subscription model for regular users.

## Technologies Used

This project is built with:

*   **Vite:** A modern, fast build tool for web development.
*   **TypeScript:** A statically typed superset of JavaScript that enhances code quality and maintainability.
*   **React:** A popular JavaScript library for building user interfaces.
*   **shadcn-ui:** A collection of reusable UI components for React.
*   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You'll need to have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your machine.

### Installation

1.  **Clone the repo**

2.  **Install NPM packages**
    ```sh
    npm install
    ```
3.  **Start the development server**
    ```sh
    npm run dev
    ```
    This will start the application in development mode, with hot-reloading enabled. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## Deployment

This application is designed to be deployed as a static site. Here are the instructions for deploying to [Render](https://render.com/).

### Prerequisites

*   A [Render](https://render.com/) account.
*   A backend service running on Render.

### Environment Variables

Set the following environment variables in the Render dashboard:

*   `VITE_API_BASE_URL`: The base URL of your backend API.
*   `VITE_SUPABASE_URL`: The URL of your Supabase project.
*   `VITE_SUPABASE_ANON_KEY`: The anonymous key for your Supabase project.

### Build & Publish

*   **Build Command:** `npm ci --prefix PlayScenarioWeb && npm run build --prefix PlayScenarioWeb`
*   **Publish Directory:** `PlayScenarioWeb/dist`
*   **Rewrite Rule:** `/* -> /index.html`
