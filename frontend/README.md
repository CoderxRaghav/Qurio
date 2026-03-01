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
