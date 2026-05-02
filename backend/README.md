Backend Setup (Express + MongoDB)
================================

Quick steps to run the backend server locally.

1. Prerequisites
   - Node.js (v16+ recommended)
   - MongoDB running locally or a MongoDB connection string

2. Install dependencies

   Open a terminal in the `backend` folder and run:

   ```bash
   npm install
   ```

3. Configure environment

   - Copy `.env.example` to `.env` and update `MONGODB_URI` if needed.

4. Start the server

   - Development (auto-reload): `npm run dev` (requires `nodemon`)
   - Production: `npm start`

   The server listens on `PORT` (default 5000). API endpoints:

   - `POST /api/orders` → store an order in MongoDB
   - `GET  /api/orders` → list stored orders

5. Connect frontend

   The frontend uses `fetch('http://localhost:5000/api/orders')` to talk to the backend.
   No changes to HTML/CSS were made. Only `script.js` includes two helper functions:

   - `sendOrderToBackend()` — called when confirming an order. It sends a POST to `/api/orders` with a payload containing `items`, `totalBoxes`, `totalProtein`, `totalCalories`, and (optional) `delivery`.
   - `fetchOrdersFromBackend()` — example GET to retrieve orders (for admin/dev use).

Example POST payload (JSON):

```json
{
  "customerName": "Guest",
  "items": [ { "name": "Grilled Chicken", "quantity": 1, "protein": 30 } ],
  "totalBoxes": 1,
  "totalProtein": 30,
  "totalCalories": 180,
  "delivery": { "date": "2026-05-03", "time": "morning" }
}
```

Example response (201 Created):

```json
{
  "_id": "642e...",
  "customerName": "Guest",
  "items": [...],
  "totalBoxes": 1,
  "totalProtein": 30,
  "totalCalories": 180,
  "delivery": { "date": "2026-05-03", "time": "morning" },
  "createdAt": "2026-05-02T12:34:56.789Z",
  "__v": 0
}
```

Notes for interview (short talking points):

- Architecture: simple Node.js + Express backend, Mongoose ODM for MongoDB. Frontend communicates via REST.
- Endpoints: `POST /api/orders` to persist orders, `GET /api/orders` to retrieve orders.
- Error handling: controllers return 500 on server errors; frontend shows notifications when network calls fail.
- Security: keep credentials in `.env` and do not commit them. In production, add authentication and input validation.
