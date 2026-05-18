<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TanStack_Router-FF4154?style=for-the-badge&logo=react-router&logoColor=white" alt="TanStack Router" />
  <img src="https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white" alt="React Query" />
  <img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white" alt="Zod" />
  <img src="https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Netlify" />
</p>

# NexCart

A modern, type-safe e-commerce frontend built with React 19 and TypeScript. NexCart is a single-page application that consumes a RESTful API (Laravel-based backend) to provide a complete online shopping experience — from browsing products to placing orders.

> **Note:** This is the frontend client. The backend API is a separate Laravel application hosted remotely.

---

## Features

### 🛍️ Product Browsing
- Product listing with category, price range, and size filtering
- Client-side pagination (12 per page)
- Dedicated pages for **New Arrivals**, **On Sale**, and **Shop All**
- Product detail page with size selector, image, and pricing

### 🔐 Authentication
- JWT-based login, registration, and logout
- Persistent sessions via `localStorage`
- Protected routes and features (wishlist, orders, checkout)

### 🛒 Shopping Cart
- Local-first cart with `localStorage` persistence
- Automatic server-side price and stock preview (when authenticated)
- Quantity management, item removal, and cart summary

### ❤️ Wishlist
- Add/remove products with instant feedback
- Seamless API sync for authenticated users

### 🧭 Routing & Navigation
- Type-safe routing with TanStack Router
- Server state management via TanStack Query (caching, refetching, loading states)
- Search param validation with Zod schemas

### 🎨 User Experience
- Fully responsive design with Tailwind CSS
- shadcn/ui component library (Radix-based)
- Skeleton loading states, empty states, and error handling
- Toast notifications for key actions
- Accessible, clean UI

---

## Tech Stack

| Category        | Technology                                      |
|-----------------|--------------------------------------------------|
| **Framework**   | React 19, TypeScript 5                           |
| **Build Tool**  | Vite 8                                           |
| **Routing**     | TanStack Router (file-based, type-safe)          |
| **Data Fetching** | TanStack Query 5                               |
| **State**       | React Context (auth, cart, wishlist)             |
| **Styling**     | Tailwind CSS 4, tw-animate-css                   |
| **Components**  | shadcn/ui (Radix primitives, CVA)                |
| **Validation**  | Zod 3                                            |
| **Auth**        | JWT (custom implementation, localStorage)        |
| **Icons**       | lucide-react, react-icons                        |
| **Deployment**  | Netlify (with API proxy)                         |

---

## Architecture Highlights

- **Frontend-only SPA** — communicates with a Laravel-based REST API via `fetch` with Bearer token auth
- **Offline-first cart** — cart persists locally and syncs with the server only for price/stock validation and checkout
- **Client-side filtering** — products are fetched and filtered/paginated on the client for a snappy UX
- **Type safety end-to-end** — API responses validated with Zod schemas, route search params also Zod-validated
- **API client layer** — centralized `api/client.ts` handles headers, error wrapping, and token injection

---

## Screenshots

| Page | Preview |
|------|---------|
| **Home** | ![Home](https://placehold.co/800x450/1a1a2e/e0e0e0?text=Home+Page) |
| **Shop** | ![Shop](https://placehold.co/800x450/16213e/e0e0e0?text=Shop+Page) |
| **Product Detail** | ![Product Detail](https://placehold.co/800x450/0f3460/e0e0e0?text=Product+Detail) |
| **Cart** | ![Cart](https://placehold.co/800x450/1a1a2e/e0e0e0?text=Cart) |
| **Checkout** | ![Checkout](https://placehold.co/800x450/16213e/e0e0e0?text=Checkout) |

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/nexcart.git
cd nexcarts

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and set your API base URL:
# VITE_API_BASE=https://your-api.test/api

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Start Vite dev server (hot reload) |
| `npm run build`   | TypeScript check + production build |
| `npm run preview` | Preview production build locally   |
| `npm run lint`    | Run ESLint                         |

---

## Environment Variables

| Variable           | Required | Description                      |
| -------------------| -------- | -------------------------------- |
| `VITE_API_BASE`    | Yes      | Backend API base URL             |

---

## Project Structure

```
src/
├── api/           # API client functions (auth, products, cart, etc.)
├── components/    # UI components (auth, cart, header, products, reviews, etc.)
├── context/       # React Context providers (Auth, Cart, Wishlist)
├── hooks/         # Custom hooks (useProductFilters)
├── lib/           # Utilities (filters, pagination, cn helper)
├── pages/         # Page-level components (one per route)
├── routes/        # TanStack Router route definitions
├── schemas/       # Zod validation schemas (product, banner, etc.)
├── assets/        # Static images
├── main.tsx       # Application entry point
└── index.css      # Tailwind + theme variables
```

---

## API Reference

The frontend interacts with a Laravel-based REST API at the configured `VITE_API_BASE` URL.

| Method | Endpoint                       | Description                      |
|--------|--------------------------------|----------------------------------|
| POST   | `/login`                       | User login                       |
| POST   | `/register`                    | User registration                |
| POST   | `/logout`                      | User logout                      |
| GET    | `/user`                        | Get authenticated user           |
| GET    | `/v1/products`                 | List products (filterable)       |
| GET    | `/v1/products/{id}`            | Get product by ID                |
| GET    | `/v1/products/by-slug/{slug}`  | Get product by slug              |
| GET    | `/v1/categories`               | List categories                  |
| GET    | `/v1/categories/{id}`          | Get category with products       |
| GET    | `/v1/banners?position=hero`    | Get hero banners                 |
| POST   | `/v1/cart/preview`             | Preview cart totals              |
| GET    | `/v1/orders`                   | List user orders                 |
| POST   | `/v1/orders`                   | Place an order                   |
| GET    | `/v1/wishlist`                 | List wishlist items              |
| POST   | `/v1/wishlist`                 | Add item to wishlist             |
| DELETE | `/v1/wishlist/{productId}`     | Remove item from wishlist        |

---

## Deployment

The app is deployed on **Netlify**. The `netlify.toml` configuration:
- Redirects all `/api/*` requests to the backend server
- Serves `index.html` for all SPA routes (404 fallback)

---

## Future Improvements

- [ ] Write unit and integration tests (Vitest + Testing Library)
- [ ] Add server-side rendering (Next.js migration)
- [ ] Implement payment gateway integration
- [ ] Add dark mode
- [ ] CI/CD pipeline with GitHub Actions

---

## License

[MIT](LICENSE)
