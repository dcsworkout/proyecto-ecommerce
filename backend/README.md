# 🏪 E-Commerce Backend - Sistema de Inventario Familiar

Backend API para el sistema de inventario multi-tienda familiar.

## 📋 Stack Tecnológico

- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Database:** PostgreSQL 15+
- **Auth:** JWT (jsonwebtoken + bcrypt)
- **Validation:** Joi
- **Dev Tools:** nodemon, morgan

## 🚀 Quick Start

### Requisitos Previos

1. **Node.js 20+** instalado ([Download](https://nodejs.org/))
2. **PostgreSQL 15+** instalado y corriendo ([Download](https://www.postgresql.org/download/))
3. **Git** para control de versiones

### Paso 1: Instalar Dependencias

```bash
cd backend
npm install
```

### Paso 2: Configurar Variables de Entorno

Copia el archivo de ejemplo y edítalo con tus datos:

```bash
cp .env.example .env
```

Edita `.env` y configura:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD_AQUI  # ⚠️ Cambia esto!
JWT_SECRET=un-secreto-muy-largo-y-aleatorio-para-produccion
```

### Paso 3: Crear Base de Datos

**Opción A: Usando psql (Recomendado)**

```bash
psql -U postgres
```

Luego en el prompt de PostgreSQL:

```sql
CREATE DATABASE ecommerce_db;
\q
```

**Opción B: Usando pgAdmin**

1. Abre pgAdmin
2. Click derecho en "Databases" → "Create" → "Database"
3. Nombre: `ecommerce_db`
4. Click "Save"

### Paso 4: Ejecutar Migraciones (Crear Tablas)

```bash
npm run db:migrate
```

Esto creará todas las tablas:
- ✅ shops
- ✅ users
- ✅ products
- ✅ inventory
- ✅ sales

### Paso 5: Cargar Datos de Prueba

```bash
npm run db:seed
```

Esto creará:
- 2 tiendas de ejemplo (María y Juan)
- 3 usuarios (2 dueños, 1 empleado)
- 10 productos
- ~50 variantes de inventario
- 5 ventas de ejemplo

**Credenciales de prueba:**
- Email: `maria@tienda.com` / Password: `password123` (Dueño)
- Email: `ana@tienda.com` / Password: `password123` (Empleado)
- Email: `juan@tienda.com` / Password: `password123` (Dueño)

### Paso 6: Iniciar el Servidor

```bash
npm run dev
```

El servidor estará corriendo en: **http://localhost:4000**

## ✅ Verificar Instalación

### 1. Health Check

Abre en tu navegador:
```
http://localhost:4000/health
```

Deberías ver:
```json
{
  "status": "ok",
  "timestamp": "2024-04-25T...",
  "uptime": 12.345,
  "environment": "development"
}
```

### 2. API Info

```
http://localhost:4000/api
```

Deberías ver la lista de endpoints disponibles.

### 3. Verificar Database

Conecta a PostgreSQL y ejecuta:

```sql
-- Ver todas las tablas
\dt

-- Ver tiendas
SELECT * FROM shops;

-- Ver usuarios
SELECT email, full_name, role FROM users;

-- Ver productos
SELECT modelo, tipo, price FROM products;

-- Ver inventario con detalles
SELECT * FROM v_inventory_detail LIMIT 10;
```

## 📁 Estructura del Proyecto

```
backend/
├── server.js                    # Entry point
├── package.json
├── .env                         # Variables de entorno (NO COMMITEAR)
├── .env.example                 # Ejemplo de variables
│
├── database/
│   ├── schema.sql              # Esquema completo de la BD
│   ├── seed.sql                # Datos de ejemplo
│   ├── migrate.js              # Script para crear tablas
│   └── seed.js                 # Script para cargar datos
│
└── src/
    ├── config/
    │   └── database.js         # Configuración de PostgreSQL
    │
    ├── controllers/            # Lógica de negocio
    │   ├── auth.controller.js
    │   ├── products.controller.js
    │   ├── inventory.controller.js
    │   ├── sales.controller.js
    │   └── analytics.controller.js
    │
    ├── middleware/             # Middleware personalizado
    │   ├── auth.js            # Verificación de JWT
    │   ├── permissions.js     # Control de roles
    │   └── validation.js      # Validación de requests
    │
    ├── routes/                # Definición de rutas
    │   ├── auth.routes.js
    │   ├── shops.routes.js
    │   ├── products.routes.js
    │   ├── inventory.routes.js
    │   ├── sales.routes.js
    │   └── analytics.routes.js
    │
    ├── services/              # Servicios (transacciones, etc)
    │   ├── auth.service.js
    │   ├── inventory.service.js
    │   └── analytics.service.js
    │
    └── utils/                 # Utilidades
        ├── logger.js
        └── validators.js
```

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor con nodemon (auto-reload)
npm start                # Inicia servidor en producción

# Base de datos
npm run db:migrate       # Crea todas las tablas
npm run db:seed          # Carga datos de ejemplo
npm run db:reset         # Borra todo y recrea desde cero

# Producción
npm run build            # (Agregar si necesitas transpilación)
```

## 🗄️ Modelo de Datos

### Relaciones

```
shops (1) ──< users (N)
shops (1) ──< products (N)
products (1) ──< inventory (N)
inventory (1) ──< sales (N)
users (1) ──< sales (N)
shops (1) ──< sales (N)
```

### Tablas Principales

**shops:** Información de cada tienda
- `id`, `name`, `slug`, `whatsapp_number`, `owner_id`

**users:** Usuarios del sistema (dueños y empleados)
- `id`, `shop_id`, `email`, `password_hash`, `full_name`, `role`

**products:** Modelos de productos
- `id`, `shop_id`, `modelo`, `tipo`, `description`, `price`, `image_urls`

**inventory:** Stock por variante (talla/color)
- `id`, `product_id`, `talla`, `color`, `quantity`, `low_stock_alert`

**sales:** Historial de ventas
- `id`, `shop_id`, `inventory_id`, `user_id`, `quantity_sold`, `sale_price`, `sale_date`

## 🔐 Autenticación

El sistema usa JWT (JSON Web Tokens) para autenticación.

**Login flow:**
1. Usuario envía email + password a `/api/auth/login`
2. Backend verifica credenciales con bcrypt
3. Si es válido, genera JWT token
4. Frontend guarda token (localStorage/cookie)
5. Cada request incluye token en header: `Authorization: Bearer <token>`

## 🚢 Deployment (Railway)

### Preparación

1. Crea cuenta en [Railway](https://railway.app)
2. Instala Railway CLI:

```bash
npm i -g @railway/cli
railway login
```

### Deploy

```bash
cd backend
railway init
railway up
```

Railway automáticamente:
- ✅ Detecta Node.js
- ✅ Instala dependencias
- ✅ Crea PostgreSQL database
- ✅ Configura DATABASE_URL

### Variables de Entorno en Railway

En el dashboard de Railway, configura:
- `JWT_SECRET` (genera uno nuevo y seguro)
- `FRONTEND_URL` (URL de Vercel cuando esté listo)
- `NODE_ENV=production`

## 🐛 Troubleshooting

### Error: "database does not exist"

```bash
psql -U postgres -c "CREATE DATABASE ecommerce_db;"
```

### Error: "password authentication failed"

Revisa tu password en `.env` y en PostgreSQL:

```bash
psql -U postgres
ALTER USER postgres PASSWORD 'nuevo_password';
```

### Error: "port 4000 already in use"

Mata el proceso:

```bash
# macOS/Linux
lsof -ti:4000 | xargs kill

# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

### Error: "module not found"

```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Próximos Pasos

- [ ] Implementar rutas de autenticación
- [ ] Crear endpoints de productos
- [ ] Implementar transacciones para ventas
- [ ] Añadir analytics dashboard
- [ ] Configurar tests unitarios
- [ ] Deploy a Railway

## 🤝 Contribuir

Este es un proyecto familiar, pero cualquier mejora es bienvenida:

1. Fork el proyecto
2. Crea tu branch (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push al branch (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📝 License

Uso privado - Proyecto familiar

---

**¿Problemas?** Abre un issue o contacta al desarrollador.

**Happy coding! 🚀**
