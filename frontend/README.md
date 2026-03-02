# AxisStudy AI Frontend

## Getting Started

Install dependencies and run the app locally:

```sh
npm install
npm run dev
```

The dev server runs on `http://localhost:8080`.

## Scripts

- `npm run dev` - start development server
- `npm run build` - build for production
- `npm run preview` - preview production build
- `npm run lint` - run ESLint
- `npm run test` - run tests once
- `npm run test:watch` - run tests in watch mode

## Stack

- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui

## Deployment (Vercel)

For public users (mobile/desktop), the frontend cannot call `127.0.0.1:8000`.
You must deploy backend separately and configure frontend with that public URL.

1. Deploy FastAPI backend to a public host (Render/Railway/VM/etc).
2. In Vercel project settings, add env var:
   - `VITE_API_BASE_URL=https://your-public-backend-domain.com`
3. Redeploy frontend after adding env var.

Without this, deployed users will see backend connection errors.

For full beginner-friendly steps, see [`../DEPLOYMENT_BEGINNER.md`](../DEPLOYMENT_BEGINNER.md).

## Firebase Auth Setup (Google + Email/Password)

1. Create a Firebase project in Firebase Console.
2. Go to `Authentication` -> `Sign-in method` and enable:
   - `Google`
   - `Email/Password`
3. In Firebase project settings, create a Web App and copy Firebase config values.
4. Add these env vars in Vercel (or local `.env`):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
5. Add your Vercel domain in Firebase -> Authentication -> Settings -> Authorized domains.
6. Redeploy frontend.
