# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/cff1bed1-d096-459b-82be-875f4897983f

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/cff1bed1-d096-459b-82be-875f4897983f) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/cff1bed1-d096-459b-82be-875f4897983f) and click on Share -> Publish.

## Deploying to Render (Staging)

You can deploy this frontend as a static site on Render and point it to the backend staging API.

1) Prerequisites
- A backend staging service running on Render (see repository root `render.yaml` for a combined blueprint).
- Backend CORS includes your frontend staging domain.

2) Environment variables (Frontend)
Set these in the Render Static Site service Environment tab (or via `render.yaml`):
- `VITE_API_BASE_URL`: Backend base URL including `/api` (example: `https://playscenario-backend-staging.onrender.com/api`).
- `VITE_SUPABASE_URL`: Your Supabase project URL (no trailing slash).
- `VITE_SUPABASE_ANON_KEY`: Supabase anon key (publishable).

3) Build & publish
- Using the repository blueprint (root `render.yaml`):
  - Render → New → Blueprint → select this repo/branch.
  - Set the three env vars above for the `playscenario-frontend-staging` service.
- Or manual static site setup:
  - Build command: `npm ci --prefix PlayScenarioWeb && npm run build --prefix PlayScenarioWeb`
  - Publish directory: `PlayScenarioWeb/dist`
  - Add SPA rewrite: `/* -> /index.html`.

4) Verify
- Open the Render URL for the static site and sign in.
- The app will call the backend at `VITE_API_BASE_URL`.
- If you see network errors, verify CORS on the backend and that `VITE_API_BASE_URL` ends with `/api`.

Notes
- Local dev uses a Vite proxy (`/api -> http://localhost:8000`), so `VITE_API_BASE_URL` is not required for `npm run dev`.
- Only use the Supabase anon key on the frontend; never expose service role keys.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
