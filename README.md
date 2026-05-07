# Storefront - Ecommerce Application

A full-featured, responsive ecommerce storefront built with Next.js 15, TypeScript, Tailwind CSS v4, and Zustand. The application features 19 fully routed pages covering the complete online shopping experience — from browsing products and managing a cart, to checkout, order tracking, and account management.

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.1.6 | App Router, SSR/SSG, file-based routing |
| **React** | 19.2.3 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **Zustand** | 5.x | Lightweight state management with localStorage persistence |
| **Lucide React** | 0.576.x | Icon library |
| **clsx + tailwind-merge** | Latest | Conditional className utilities |

## Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **npm** 9+ (or yarn/pnpm/bun)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd storefront

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
storefront/
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── layout.tsx              # Root layout (Header, Footer, CartDrawer, StoreModal)
│   │   ├── globals.css             # Tailwind + CSS custom properties
│   │   ├── page.tsx                # Landing page
│   │   ├── product/[id]/           # Product detail page
│   │   ├── cart/                   # Shopping cart
│   │   ├── categories/             # Category hub
│   │   │   └── [slug]/            # Category product listing
│   │   ├── checkout/               # Checkout flow
│   │   │   └── address/new/       # Add new address form
│   │   ├── order-success/          # Order confirmation
│   │   ├── deals/                  # Flash sales & deals
│   │   ├── search/                 # Search results with filters
│   │   ├── account/                # User account & wishlist
│   │   ├── stores/                 # Store directory
│   │   │   └── [id]/             # Store detail
│   │   ├── track-order/            # Order tracking search
│   │   ├── order/[id]/             # Live order tracking
│   │   ├── contact/                # Contact & FAQ
│   │   ├── terms/                  # Terms & privacy
│   │   ├── login/                  # Login page
│   │   └── register/               # Registration page
│   │
│   ├── components/                 # Reusable UI components
│   │   ├── layout/                 # Header, Footer, Breadcrumb
│   │   ├── ui/                     # Button, Input, Badge, Modal, Toast, ProgressSteps
│   │   ├── product/                # ProductCard, ProductGrid, ProductGallery, CompareModal
│   │   ├── cart/                   # CartDrawer, CartItem, CartSummary
│   │   ├── checkout/               # ShippingForm, PaymentForm, QRPayment, OrderSummary, AddressCard
│   │   ├── home/                   # HeroCarousel, CategorySection, TrustBadges, Newsletter
│   │   ├── store/                  # StoreModal, StoreCard, StoreMap
│   │   ├── search/                 # SearchFilters, SearchBar
│   │   └── account/                # AccountSidebar, WishlistGrid, OrderList
│   │
│   ├── store/                      # Zustand state management
│   │   ├── useCartStore.ts         # Cart items, add/remove/update, totals
│   │   ├── useStoreStore.ts        # Selected store, store list
│   │   ├── useUserStore.ts         # Auth, wishlist, addresses, orders
│   │   └── useUIStore.ts           # Modals, drawers, toasts, search
│   │
│   ├── data/                       # Mock data
│   │   ├── products.ts             # Product catalog (12 items)
│   │   ├── categories.ts           # Product categories
│   │   ├── stores.ts               # Physical store locations
│   │   └── constants.ts            # Hero slides, trust badges, FAQs, etc.
│   │
│   ├── services/                   # Data access layer (API-ready stubs)
│   │   ├── productService.ts       # Product queries & filtering
│   │   ├── storeService.ts         # Store lookup & nearby search
│   │   ├── orderService.ts         # Order tracking
│   │   └── userService.ts          # Authentication stubs
│   │
│   ├── types/
│   │   └── index.ts                # All TypeScript interfaces
│   │
│   └── lib/
│       ├── cn.ts                   # clsx + tailwind-merge utility
│       ├── utils.ts                # formatPrice, formatDate helpers
│       └── useMounted.ts           # Hydration-safe mount hook
│
└── public/                         # Static assets
```

## Pages & Routes

| Route | Description |
|---|---|
| `/` | Landing page with hero carousel, categories, featured products, trust badges |
| `/product/[id]` | Product detail with gallery, specs, color selector, related products |
| `/cart` | Full cart with item management, promo codes, recommendations |
| `/categories` | Category hub with grouped cards |
| `/categories/[slug]` | Category listing with sort & filter chips |
| `/checkout` | Multi-step checkout: shipping, card/QR payment, order summary |
| `/checkout/address/new` | Add new shipping address form |
| `/order-success` | Order confirmation page |
| `/deals` | Flash sales with discount badges and category tabs |
| `/search` | Search results with sidebar filters and no-results state |
| `/account` | User account with wishlist grid and order history |
| `/stores` | Store directory with location cards |
| `/stores/[id]` | Store detail with map, info, and nearby stores |
| `/track-order` | Order tracking search with timeline |
| `/order/[id]` | Live order tracking with delivery progress |
| `/contact` | Contact methods (WhatsApp, email, phone), FAQ accordion, HQ map |
| `/terms` | Terms of service & privacy policy with sidebar navigation |
| `/login` | Login page with split layout |
| `/register` | Registration page with split layout |

## Design System

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--primary` | `#0D6E6E` | Primary teal — buttons, links, accents |
| `--primary-light` | `#E6F2F2` | Primary tint — badges, icon backgrounds |
| `--text-dark` | `#1A1A1A` | Headings, primary text |
| `--text-muted` | `#666666` | Secondary text, descriptions |
| `--text-light` | `#888888` | Tertiary text |
| `--text-placeholder` | `#999999` | Input placeholders |
| `--bg-light` | `#F8F9FA` | Section backgrounds |
| `--bg-warm` | `#F5F5F0` | Warm section backgrounds |
| `--border` | `#E5E5E5` | Default borders |
| `--border-light` | `#EAEAEA` | Subtle borders |
| `--footer-dark` | `#1A1A1A` | Footer background |
| `--success` | `#22C55E` | Success states |
| `--error` | `#FF3366` | Error states, flash sale accents |
| `--warning` | `#B8860B` | Warning states |

### Typography

- **Font**: Inter (loaded via `next/font/google`)
- **Weights**: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

### Spacing & Radius

- **Page padding**: `px-4` (mobile) → `px-6` (tablet) → `px-20` (desktop)
- **Border radius**: `8px` (inputs), `12px` (cards), `16px` (modals), `24px` (large banners)

## State Management

The app uses **Zustand** with `persist` middleware for client-side state that survives page refreshes:

### `useCartStore`
- Cart items with quantity, color variant, store grouping
- Actions: `addItem`, `removeItem`, `updateQuantity`, `clearCart`
- Computed: `getSubtotal`, `getTax`, `getTotal`, `getItemCount`

### `useStoreStore`
- Currently selected physical store
- Persisted to localStorage

### `useUserStore`
- Authentication state, user profile
- Wishlist management
- Saved addresses (2 defaults provided)
- Order history

### `useUIStore`
- Cart drawer open/close
- Store selector modal
- Compare modal
- Toast notifications (auto-dismiss after 3s)
- Search query state

> **Hydration note**: Components that read persisted Zustand state use the `useMounted()` hook to prevent server/client HTML mismatches.

## Responsive Design

All pages are fully responsive across three breakpoints:

| Breakpoint | Width | Behavior |
|---|---|---|
| **Mobile** | < 640px | Single column, stacked layouts, hamburger menu |
| **Tablet** | 640px - 1023px | 2-column grids, compact spacing |
| **Desktop** | 1024px+ | Full layout matching the design spec (1440px) |

Key responsive patterns:
- **Header**: Hamburger menu with slide-out navigation on mobile
- **Grids**: `grid-cols-1` → `sm:grid-cols-2` → `lg:grid-cols-3/4`
- **Sidebars**: Stack below content on mobile (`flex-col lg:flex-row`)
- **Login/Register**: Visual panels hidden on mobile (`hidden lg:flex`)
- **Cart drawer**: Full-width overlay on mobile

## Service Layer

All data access goes through the `services/` layer, making it straightforward to swap mock data for real API calls:

```typescript
// services/productService.ts
getProductById(id: string): Product | undefined
getProductsByCategory(slug: string): Product[]
searchProducts(query: string): Product[]
getFeaturedProducts(limit?: number): Product[]

// services/storeService.ts
getStoreById(id: string): Store | undefined
getNearbyStores(storeId: string, limit?: number): Store[]

// services/orderService.ts
getOrderById(id: string): Order | undefined
trackOrder(orderId: string): Order | undefined

// services/userService.ts
login(email: string, password: string): User | null
register(data: RegisterData): User
```

## TypeScript Interfaces

All types are centralized in `src/types/index.ts`:

- `Product` — Full product with variants, specs, colors, images
- `CartItem` — Product reference with quantity and selected options
- `Category` — Category with slug, icon, product count
- `Store` — Physical store with address, hours, coordinates
- `User` — User profile with auth state
- `Address` — Shipping address with label and geolocation
- `Order` — Order with status, tracking, shipping address
- `WishlistItem` — Saved product reference
- `HeroSlide` — Carousel slide configuration
- `FAQItem` — Question/answer pair
- `SearchFilters` — Active search filter state
- `Toast` — Notification with type and auto-dismiss

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["npm", "start"]
```

### Static Export

```bash
# Add to next.config.ts:
# output: 'export'

npm run build
# Output in /out directory
```

## License

This project is private and not licensed for public distribution.
# on-suite_app
# on-suite_app
