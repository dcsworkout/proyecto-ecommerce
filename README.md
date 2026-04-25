# 🏪 Sistema de Inventario Multi-Tienda Familiar

Sistema completo de e-commerce e inventario para negocios familiares con múltiples tiendas.

## 🎯 Características

### 📱 Lado Público (E-commerce)
- Catálogo de productos de todas las tiendas
- Filtros por tipo, talla y color
- Detalle de productos con galería de imágenes
- Botón directo a WhatsApp (no compras en línea)
- Diseño responsive (móvil, tablet, desktop)

### 🔐 Lado Privado (Admin Dashboard)
- Login con autenticación JWT
- Dashboard con métricas en tiempo real
- Registro rápido de ventas (3 clicks)
- Gestión de inventario automática
- Reportes y analytics
- Control de permisos (dueños vs empleados)
- Multi-tenant (cada tienda ve solo sus datos)

## 🛠️ Stack Tecnológico

```
┌─────────────────────────────────────┐
│     Frontend (Nuxt 3)               │
│  Vue 3 + Pinia + Tailwind CSS       │
│  Deploy: Vercel (Free)              │
└─────────────────────────────────────┘
            │ HTTP REST API
            ▼
┌─────────────────────────────────────┐
│     Backend (Express)               │
│  Node.js + JWT Auth                 │
│  Deploy: Railway (Free)             │
└─────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────┐
│     Database (PostgreSQL)           │
│  Multi-tenant + Transactions        │
│  Host: Railway (Free)               │
└─────────────────────────────────────┘
```

## 📦 Estructura del Proyecto

```
proyecto-ecommerce/
├── backend/                 # API Express + PostgreSQL
│   ├── src/
│   │   ├── config/         # Database, JWT config
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Auth, permissions
│   │   ├── routes/         # API endpoints
│   │   └── services/       # Transactions, analytics
│   ├── database/
│   │   ├── schema.sql      # Database schema
│   │   └── seed.sql        # Sample data
│   └── server.js           # Entry point
│
└── frontend/                # Nuxt 3 app
    ├── pages/              # Routes (file-based routing)
    ├── components/         # Vue components
    ├── stores/             # Pinia stores
    ├── composables/        # Reusable logic
    └── nuxt.config.ts      # Nuxt configuration
```

## 🚀 Quick Start

### Backend (Primero)

```bash
# 1. Instalar dependencias
cd backend
npm install

# 2. Configurar .env
cp .env.example .env
# Edita .env con tus credenciales de PostgreSQL

# 3. Crear base de datos
psql -U postgres -c "CREATE DATABASE ecommerce_db;"

# 4. Ejecutar migraciones
npm run db:migrate

# 5. Cargar datos de ejemplo
npm run db:seed

# 6. Iniciar servidor
npm run dev
# Backend corriendo en http://localhost:4000
```

### Frontend (Después)

```bash
# 1. Instalar dependencias
cd frontend
npm install

# 2. Configurar .env
cp .env.example .env
# NUXT_PUBLIC_API_URL=http://localhost:4000/api

# 3. Iniciar dev server
npm run dev
# Frontend corriendo en http://localhost:3000
```

## 📊 Modelo de Datos

```sql
shops (Tiendas)
├── id, name, slug, whatsapp_number
└── owner_id → users

users (Dueños y Empleados)
├── id, shop_id, email, password_hash
├── full_name, role (owner/employee)
└── shop_id → shops

products (Productos/Modelos)
├── id, shop_id, modelo, tipo
├── description, price, image_urls
└── shop_id → shops

inventory (Stock por Variante)
├── id, product_id, talla, color
├── quantity, low_stock_alert
└── product_id → products

sales (Historial de Ventas)
├── id, shop_id, inventory_id, user_id
├── quantity_sold, sale_price, sale_date
├── shop_id → shops
├── inventory_id → inventory
└── user_id → users
```

## 🔐 Autenticación y Permisos

### Roles

| Acción | Owner | Employee | Público |
|--------|-------|----------|---------|
| Ver catálogo | ✅ | ✅ | ✅ |
| Registrar venta | ✅ | ✅ | ❌ |
| Eliminar venta | ✅ | ❌ | ❌ |
| Agregar producto | ✅ | ❌ | ❌ |
| Ver analytics | ✅ | ✅ (limitado) | ❌ |

### Login

```javascript
// POST /api/auth/login
{
  "email": "maria@tienda.com",
  "password": "password123"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "full_name": "María González",
    "role": "owner",
    "shop": {
      "id": "...",
      "name": "Tienda de María",
      "slug": "maria"
    }
  }
}
```

## 🚢 Deployment

### Backend + Database (Railway)

```bash
# 1. Instalar Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Deploy
cd backend
railway init
railway up

# 4. Agregar PostgreSQL
# En Railway dashboard: New → Database → PostgreSQL

# 5. Configurar variables de entorno
# JWT_SECRET, FRONTEND_URL, NODE_ENV=production
```

### Frontend (Vercel)

```bash
# 1. Instalar Vercel CLI (opcional)
npm i -g vercel

# 2. Deploy
cd frontend
vercel

# O conecta tu repo GitHub a Vercel
```

## 💰 Costos

```
Railway (Backend + DB): $0-5/mes (free tier)
Vercel (Frontend):      $0/mes (free tier)
──────────────────────────────────────────
Total estimado:         $0-5/mes 🎉
```

## 📈 Roadmap

### Fase 1: Backend (Semana 1-2) ✅ IN PROGRESS
- [x] Database schema
- [x] Sample data
- [x] Express server setup
- [ ] Auth endpoints (login/register)
- [ ] Products CRUD
- [ ] Sales with transactions
- [ ] Analytics queries

### Fase 2: Frontend (Semana 3-4)
- [ ] Nuxt setup
- [ ] Public catalog with filters
- [ ] Product detail page
- [ ] Login page
- [ ] Admin dashboard
- [ ] Register sale form
- [ ] Analytics charts

### Fase 3: Deploy & Testing (Semana 5)
- [ ] Railway deployment
- [ ] Vercel deployment
- [ ] Testing con la familia
- [ ] Bug fixes & improvements

### Fase 4: Mejoras Futuras
- [ ] Subida de imágenes reales
- [ ] Reportes en PDF/Excel
- [ ] Notificaciones de stock bajo
- [ ] Sistema de descuentos
- [ ] Integración con pagos (opcional)

## 🐛 Troubleshooting

Ver READMEs específicos:
- Backend: `backend/README.md`
- Frontend: `frontend/README.md`

## 🤝 Equipo

- **Desarrollador:** David (Salesforce Dev transitioning to full-stack)
- **Usuarios:** Familia (2-3 tiendas)
- **Tech Stack:** JavaScript everywhere 💛

## 📝 Notas

- Este es un proyecto **familiar** sin fines comerciales
- Contraseña por defecto de ejemplo: `password123`
- Cambiar **TODOS** los secretos en producción
- Los datos de ejemplo son ficticios

---

**¿Preguntas?** Revisa los READMEs individuales o abre un issue.

**¡A construir! 🚀**
