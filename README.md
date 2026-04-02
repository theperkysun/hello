# FoodiesZenith Starter (Next.js + FastAPI)

This repository contains a lightweight implementation of the FoodiesZenith functional specification:

- `frontend/` – Next.js pages for public and admin experiences.
- `backend/` – FastAPI API with endpoints for auth, menu, search, QR, restaurant info, reviews, and gift cards.

## Run locally

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev
```

## Implemented pages

- `/`, `/menu`, `/about`, `/contact`
- `/admin/login`, `/admin/dashboard`, `/admin/menu`, `/admin/qr`, `/admin/info`

## Implemented API endpoints

- Auth: `/auth/login`, `/auth/register`, `/auth/refresh`
- Menu: `/menu`, `/menu/highlights`, `/menu/categories`, `/menu/items/{id}`, `/menu/search`
- QR: `/qr/menu`
- Restaurant: `/restaurant/info`
- Admin: `/dashboard/summary`
- Additional: `/reviews`, `/giftcards/purchase`, `/giftcards/{code}`
