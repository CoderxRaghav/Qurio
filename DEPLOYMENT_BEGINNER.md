# Beginner Deployment Guide

This project has 2 parts:
- Frontend (Vercel)
- Backend API (Render/Railway/Fly/etc)

If frontend is public but backend is only on your laptop, users will get connection errors.

## 1) Deploy Backend (Render - easiest start)

1. Go to Render -> New -> **Web Service**.
2. Connect this GitHub repo.
3. Set:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn api:app --host 0.0.0.0 --port $PORT`
4. Add environment variables:
   - `LLM_BACKEND=openai_compatible`
   - `LLM_BASE_URL=https://openrouter.ai/api/v1` (or your provider base URL)
   - `LLM_MODEL=meta-llama/llama-3.1-8b-instruct:free` (or your chosen model)
   - `LLM_API_KEY=<your_real_key>`
5. Deploy.
6. After deploy, open backend URL and test:
   - `https://your-backend-url.onrender.com/`
   - You should see status JSON.

## 2) Connect Frontend (Vercel)

1. Open Vercel project -> Settings -> Environment Variables.
2. Set:
   - `VITE_API_BASE_URL=https://your-backend-url.onrender.com`
3. Redeploy frontend.

## 3) Verify End-to-End

1. Open your Vercel frontend on mobile.
2. Run:
   - Ask Qurio AI
   - Generate Topic Paper
   - History/Analysis pages
3. If any fails:
   - Check backend service logs first.
   - Confirm `LLM_API_KEY` is valid.
   - Confirm backend URL in Vercel env has `https://` and no trailing slash.

## Important Notes

- `127.0.0.1` works only on the same machine, never for public users.
- The `/generate` file pipeline may require OCR/system tools depending on uploaded files.
- For a first stable public setup, prioritize Ask/Topic/History features first.
