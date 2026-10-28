# Orders & Products

A single-page application for tracking incoming orders and the products they carry: an order list with an expandable detail panel, a product catalogue with a type filter, a live counter of open tabs over WebSocket, and a summary dashboard.

Built as a test assignment. Stack: Nuxt 4 (Vue 3, SSR) + Vuex 4 + Bootstrap 5 + TypeScript.

---

## Features

**Orders** (`/orders`)

- list of orders with the number of products, the creation date in two formats and the total in two currencies;
- clicking an order opens its products in a panel next to the list; the panel closes with the cross;
- deleting an order or a single product goes through a confirmation dialog.

**Products** (`/products`)

- every product with a filter by type;
- each row shows the title, serial number, condition, guarantee period, price in two currencies, type, the order it belongs to and the date;
- deleting a product goes through a confirmation dialog.

**Dashboard** (`/dashboard`)

- order and product totals, with currency sums computed in a Web Worker;
- distribution of products by type (Chart.js);
- a force graph linking orders and product types (d3-force);
- a warehouse map (Leaflet);
- an activity feed fed by the domain event bus.

**Everywhere**

- top bar with a live date and clock and a counter of active sessions over Socket.IO;
- search across orders and products;
- language switch (Russian, English);
- transitions between routes and on list changes.

---

## Requirements

- **Node.js 22** or newer;
- **pnpm 10** — enable it with `corepack enable` (ships with Node).

Check:

```bash
node -v
pnpm -v
```

---

## Running locally

**1. Clone the repository**

```bash
git clone https://github.com/Andriikryl/dzencode-orders-products.git
cd dzencode-orders-products
```

**2. Install dependencies**

```bash
pnpm install
```

**3. Create the environment file**

```bash
cp .env.example .env
```

The defaults are enough to run locally.

**4. Start the app and the socket server**

```bash
pnpm dev:all
```

The app starts on <http://localhost:3000>, the socket server on port 3001.

To run them separately, use two terminals:

```bash
pnpm dev
```

```bash
pnpm socket
```

The session counter only works while the socket server is running. Open the app in several tabs to see it change.

---

## Running with Docker

Builds and starts both services — the app and the socket server:

```bash
docker compose up --build
```

The app is then available on <http://localhost:3000>.

To stop:

```bash
docker compose down
```

---

## Environment variables

| Variable                      | Default                   | Purpose                                            |
| ----------------------------- | ------------------------- | -------------------------------------------------- |
| `NUXT_PUBLIC_SOCKET_URL`      | `http://localhost:3001`   | socket server address used by the browser          |
| `PUBLIC_SOCKET_URL`           | `http://localhost:3001`   | the same value for `docker-compose`                |
| `SOCKET_CORS_ORIGIN`          | `*`                       | allowed origin for the socket server               |
| `JWT_SECRET`                  | `change-me-in-production` | signs the session token                            |
| `NUXT_PUBLIC_VITALS_ENDPOINT` | empty                     | where to send Web Vitals; empty means no reporting |

---

## Scripts

| Command             | What it does                    |
| ------------------- | ------------------------------- |
| `pnpm dev`          | development server on port 3000 |
| `pnpm socket`       | Socket.IO server on port 3001   |
| `pnpm dev:all`      | both processes in one command   |
| `pnpm build`        | production build                |
| `pnpm preview`      | serve the production build      |
| `pnpm test`         | run every test                  |
| `pnpm test:watch`   | tests in watch mode             |
| `pnpm lint`         | ESLint check                    |
| `pnpm lint:fix`     | ESLint autofix                  |
| `pnpm format`       | format with Prettier            |
| `pnpm format:check` | check formatting                |

---

## Tests

```bash
pnpm test
```

- `tests/unit` — the Vuex store and the formatting helpers;
- `tests/integration` — the path from a store action through the event bus into the activity feed;
- `tests/functional` — order and product row components mounted in a Nuxt environment.

---

## Project layout

```
app/
  components/   UI components
  composables/  store access, formatting, socket, Web Worker
  pages/        orders, products, dashboard
  plugins/      Vuex, domain events, persistence, Web Vitals
  store/        Vuex store: state, getters, mutations, actions
  workers/      order totals computed off the main thread
  lib/          domain event bus
  utils/        date and amount formatting
server/
  api/          REST endpoints and GraphQL
  middleware/   session and auth
  utils/        data generation, GraphQL schema, JWT
socket-server/  standalone Socket.IO service
i18n/locales/   translations
tests/          unit, integration, functional
```

---

## Design notes

**State.** The Vuex store holds both data and UI state. Pages never commit mutations directly: they dispatch actions (`deleteOrder`, `deleteProduct`, `setTypeFilter`, `toggleOrder`), and the actions change the state and announce what happened on the event bus.

**Events.** The domain event bus (`app/lib/events.ts`) separates what happened from who reacts to it. The dashboard activity feed is one of its subscribers.

**Persistence.** The type filter and the open order live in a cookie, so the server sees them and server and client render the same markup. The activity feed lives in `localStorage`, since it does not affect server rendering.

**Performance.** The heavy dashboard blocks load lazily and on the client only, order totals are computed in a Web Worker, and Web Vitals are reported to an endpoint when one is configured.

**Styling.** BEM class names, scoped styles, Bootstrap 5 underneath.
