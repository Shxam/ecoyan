# 🌿 Ecoyaan — Eco Checkout

A modern, mobile-first 4-step e-commerce checkout flow built with **Next.js 14 App Router**, featuring SSR, persistent global state, multi-address management, validated forms, and an elegant green-themed UI.

---

## 📸 Screens

| Step | Route | Screen |
|------|-------|--------|
| 1 | `/` | Cart — view items, adjust quantities, see order summary |
| 2 | `/checkout/shipping` | Shipping — add/edit/remove multiple delivery addresses |
| 3 | `/checkout/payment` | Payment — card details with live card visual preview |
| 4 | `/checkout/success` | Done — order confirmation with delivery estimate |

---

## 🚀 Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | Full-stack React framework |
| TypeScript | Type safety across all files |
| Tailwind CSS | Utility-first styling |
| React Context API | Global checkout state |
| localStorage | Client-side persistence across reloads |
| Server Components | SSR cart data fetching |
| Mock API Route | Simulated backend (`/api/cart`) |

---

## 📂 Project Structure

```
greencart/
│
├── app/                              # Next.js App Router pages
│   ├── globals.css                   # CSS variables, Google Fonts, animations
│   ├── layout.tsx                    # Root layout — wraps app in CheckoutProvider
│   ├── page.tsx                      # Step 1: Cart page (Server Component + SSR)
│   │
│   ├── api/cart/
│   │   └── route.ts                  # Mock GET /api/cart — returns cart items + shipping fee
│   │
│   └── checkout/
│       ├── shipping/page.tsx         # Step 2: Shipping address page
│       ├── payment/page.tsx          # Step 3: Payment page
│       └── success/page.tsx          # Step 4: Order success page
│
├── components/
│   │
│   ├── ui/                           # Shared UI — used across all steps
│   │   ├── Header.tsx                # Sticky top bar with logo + secure tag
│   │   ├── Stepper.tsx               # Animated 4-step progress indicator
│   │   └── StickyFooter.tsx          # Pinned bottom bar with Back + Next buttons
│   │
│   ├── cart/
│   │   ├── CartClient.tsx            # Cart page shell (Client Component, receives SSR data)
│   │   ├── CartItemRow.tsx           # Single cart item with +/- quantity controls
│   │   └── OrderSummary.tsx          # Subtotal / shipping / total summary card
│   │
│   ├── shipping/
│   │   ├── ShippingForm.tsx          # Full shipping step — address list + form toggling
│   │   ├── AddressCard.tsx           # Single saved address with select / edit / remove
│   │   └── AddressForm.tsx           # Add or edit address form with field validation
│   │
│   ├── payment/
│   │   └── PaymentForm.tsx           # Live card visual + card number / expiry / CVV form
│   │
│   └── success/
│       └── SuccessView.tsx           # Order confirmed screen with eco-impact summary
│
├── context/
│   └── CheckoutContext.tsx           # React Context — global state + localStorage sync
│
├── lib/
│   └── utils.ts                      # Shared helpers: formatINR, validate, maskCard, maskExpiry
│
├── types/
│   └── index.ts                      # All TypeScript interfaces: CartItem, Address, PaymentData
│
├── .env.local                        # NEXT_PUBLIC_BASE_URL for local SSR API calls
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
└── package.json
```

---

## ⚙️ Running Locally

### Prerequisites

Make sure **Node.js v18 or higher** is installed:

```bash
node -v
```

If not installed, download from [nodejs.org](https://nodejs.org) (choose the **LTS** version).

---

### Step-by-step Setup

**1. Unzip and enter the project folder**

```bash
unzip greencart.zip
cd greencart
```

**2. Install dependencies**

```bash
npm install
```

**3. Start the development server**

```bash
npm run dev
```

**4. Open in your browser**

```
http://localhost:3000
```

---

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimised production build |
| `npm start` | Run the production build |
| `npm run lint` | Run ESLint checks |

---

## 🏗️ Architectural Decisions

### 1. Server Component for Cart (SSR)

`app/page.tsx` is a **Server Component** that fetches cart data from the mock API at request time. This gives a fast, pre-rendered first load with no layout shift. The data is handed off to `CartClient.tsx` which hydrates into the interactive client component.

```
Browser Request
     ↓
Server Component (app/page.tsx)
     ↓
Mock API (/api/cart)
     ↓
Pre-rendered HTML sent to browser
     ↓
CartClient.tsx hydrates → connects to Context
```

### 2. React Context + localStorage for Persistence

`CheckoutContext.tsx` manages all shared state across steps:

- **Hydration on mount** — reads from `localStorage` so state survives page reloads
- **Auto-save on every change** — a `useEffect` writes to `localStorage` whenever state updates
- **Shared across routes** — the Context provider wraps the entire app in `layout.tsx`

State persisted: cart quantities · all saved addresses · selected address · payment fields · order number.

### 3. Sticky Footer Navigation

`StickyFooter.tsx` is `position: fixed` and constrained to `max-width: 480px` matching the app shell. The **Back** and **Next Step** buttons always sit together in one bar, regardless of page content length. Labels and icons adapt per step.

### 4. Multiple Address Management

Addresses are stored as an `Address[]` array in Context. The shipping step manages three form modes:

| Mode | Behaviour |
|---|---|
| `'none'` | Show address list only |
| `'add'` | Show blank form below list |
| `{ editIndex: number }` | Show pre-filled form for that address |

Each address has a `type` (`home` / `work` / `other`), full Indian address fields, and is validated before saving.

### 5. Input Masking & Validation

All validation logic lives in `lib/utils.ts` as pure functions, keeping components clean:

| Utility | Description |
|---|---|
| `maskCardNumber` | Auto-inserts spaces every 4 digits |
| `maskExpiry` | Auto-formats to `MM/YY`, clamps month to `01–12` |
| `validateAddress` | Returns a `ValidationErrors` map for all address fields |
| `validatePayment` | Validates card number length, expiry format, CVV |

### 6. Component Separation

| Layer | Responsibility |
|---|---|
| `types/index.ts` | All interfaces — single source of truth |
| `lib/utils.ts` | Pure functions with no React dependencies |
| `context/` | State — no UI logic |
| `components/ui/` | Layout primitives shared across all steps |
| `components/<step>/` | Step-specific UI — imports from context and ui |
| `app/<route>/page.tsx` | Thin route files — just import and render the component |

---

## ☁️ Deploying to Vercel

```bash
npm install -g vercel
vercel
```

Vercel auto-detects Next.js. The `VERCEL_URL` environment variable is set automatically so the SSR cart fetch works in production without any extra configuration.

---

## 🔮 Future Improvements

- Payment gateway integration (Razorpay / Stripe)
- User authentication and order history
- Real backend API with database
- Product catalogue and search
- Address auto-complete using Google Places API
- Email order confirmation

---

## 👨‍💻 Author

Built as part of the **Ecoyaan Frontend Assignment** — demonstrating modern Next.js 14 architecture with a focus on elegant UI, mobile-first design, and production-quality code structure.
