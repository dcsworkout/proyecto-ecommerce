# Tiendas Familiares 🛍️

Multi-shop e-commerce platform for a family business in Mérida, Yucatán. Customers browse products and contact via WhatsApp. Family members log in to register sales and manage inventory.

**Live:** [proyecto-ecommerce-steel.vercel.app](https://proyecto-ecommerce-steel.vercel.app)

---

## Shops

| Shop | URL |
|------|-----|
| Tienda CS | `/tiendacs` |
| Tienda MS | `/tiendams` |
| Admin | `/login` |

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Nuxt 4 · Vue 3 · Pinia · Tailwind → Vercel |
| Backend | Node.js · Express → Railway |
| Database | PostgreSQL → Railway |
| Images | Cloudinary |
| Auth | JWT |
| CI/CD | Push to `master` → auto-deploy |

---

## Local Setup

```bash
# Clone
git clone https://github.com/dcsworkout/proyecto-ecommerce.git
cd proyecto-ecommerce

# Backend (port 4000)
cd backend
npm install
npm run dev

# Frontend (port 3000)
cd frontend
npm install
npm run dev
```

### Environment Variables

**Railway (backend):**
```
DATABASE_URL=...
JWT_SECRET=...
NODE_ENV=production
FRONTEND_URL=https://proyecto-ecommerce-steel.vercel.app
```

**Vercel (frontend):**
```
NUXT_PUBLIC_API_BASE=https://proyecto-ecommerce-production-4ed8.up.railway.app/api
```

---

## Database

Tables: `shops` · `users` · `products` · `inventory` · `sales` · `product_costs`

```bash
# Connect
psql $DATABASE_URL
```

---

## Features

### Public
- Dynamic landing from DB
- Multi-shop catalog (`/tiendacs`, `/tiendams`) with filters by tipo, talla, color
- Product detail page with talla/color selector and WhatsApp redirect
- Luxury Yucatán design system, fully responsive

### Admin
| Tab | Description |
|-----|-------------|
| Registrar Venta | Catalog flow (product → talla → color → price) or **free entry** mode for off-catalog items |
| Mi Domingo | Week-over-week stats, top products, best days, profit calculator |
| Mis Productos | Add with Cloudinary photo upload (5MB max), inline edit, show/hide, variant management |
| Configuración | Shop name, WhatsApp number |
| Historial | Sales history with date range filters and period totals |

### Backend
- Multi-tenant isolation via `shop_id` from JWT
- Inventory transactions with `FOR UPDATE` row locking (prevents race conditions)
- Free-mode sales skip inventory decrement, store description in `notes`

---

## Design System

```
Background:   #FAF7F2
Header/Footer: #2C1810
Accent:       #8B5E3C
Gold:         #C9A96E
Band:         #E8D5B0
Border:       #E8DFD0
Fonts:        Georgia (headings) · sans-serif (body)
```

---

## Deploy

```bash
git add .
git commit -m "mensaje"
git push  # triggers auto-deploy on Vercel + Railway
```

---

## Backlog

- [ ] Password change screen
- [ ] More products for Tienda MS
- [ ] Export CSV
- [ ] Custom domain / subdomains per shop
