# Apple Store Malaysia

A mobile-first shopping web application for browsing products, selecting product variants, managing a shopping cart, placing orders, and viewing order status.

## Features

- **Home page** — displays products marked with the `custom_label_0` value `flashsale` and a set of recommended products.
- **Shop** — browse the loaded catalog, search by product title or `item_group_id`, and filter by product type.
- **Product details** — view product information and select available color and storage variants.
- **Shopping cart** — add products, increase quantities by adding the same variant again, remove items, and continue to checkout.
- **Checkout** — submit an order with item, address, shipping, and payment-method information.
- **Order tracking** — request and display order details and status.
- **Profile** — provides login and registration forms that call the configured users endpoint.

Feature availability depends on the backend endpoints and data being correctly configured. See [Backend integration](#backend-integration) and [Known limitations](#known-limitations).

## Technology stack

- React and React DOM
- Vite
- JavaScript with ES modules
- React Router DOM
- Supabase Edge Functions as HTTP API endpoints

The frontend uses the browser Fetch API to communicate with the backend. The dependencies in `package.json` currently use the `latest` tag; exact package versions may therefore vary when dependencies are installed.

## Requirements

- Node.js and npm
- Access to the configured backend endpoints for product, user, and order operations

The repository does not currently specify a minimum Node.js version. Use a supported Node.js release compatible with the installed Vite version.

## Installation

Clone the repository and install its dependencies:

```bash
git clone https://github.com/applestoree/applestoremalaysia.git
cd applestoremalaysia
npm install
```

## Environment configuration

The frontend reads `VITE_SUPABASE_URL` from the Vite environment. If it is not set, `src/constants.js` falls back to the URL currently defined in that file.

To override the URL for local development, create a `.env.local` file in the project root:

```dotenv
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
```

Replace the example URL with the Supabase project URL that hosts the required functions. Do not put a Supabase service-role key or other server-side secrets in a `VITE_*` variable: Vite exposes these variables to frontend code.

The frontend builds these endpoint URLs from `VITE_SUPABASE_URL`:

| Purpose | Endpoint path |
| --- | --- |
| Products | `/functions/v1/apple-produk` |
| Users | `/functions/v1/apple-users` |
| Orders | `/functions/v1/apple-orders` |

These paths are derived from `src/constants.js`. The backend implementation and deployment status of the users and orders functions were not verified during this README update.

## Run locally

Start the Vite development server:

```bash
npm run dev
```

The Vite configuration sets the development server to port `3000`. Open the local URL printed by Vite in your terminal.

## Build and preview

Create a production build:

```bash
npm run build
```

Vite writes the production output to `dist/` by default. Preview the built application locally with:

```bash
npm run preview
```

The preview server is configured to use port `3000`.

## Project structure

Key files and directories verified in the repository:

```text
.
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── style.css
│   ├── constants.js
│   ├── utils.js
│   ├── hooks/
│   │   └── useProducts.js
│   └── components/
│       ├── AppShell.jsx
│       ├── Header.jsx
│       ├── BottomNav.jsx
│       ├── HomePage.jsx
│       ├── ShopPage.jsx
│       ├── ProductDetailPage.jsx
│       ├── ProductList.jsx
│       ├── ProductCard.jsx
│       ├── CartDrawer.jsx
│       ├── CheckoutPage.jsx
│       ├── TrackingPage.jsx
│       └── VariantBottomSheet.jsx
└── supabase/
    └── functions/
        └── apple-produk/
            └── index.ts
```

This is a list of key files, not an exhaustive directory listing.

## Backend integration

### Products

The frontend requests the product catalog from `/functions/v1/apple-produk`. The available Edge Function source is `supabase/functions/apple-produk/index.ts`; it queries the `apple_produk` table.

The function source implements:

- `GET` to return the catalog, ordered by `created_at` descending.
- `GET` with an item identifier to retrieve a product by `item_group_id`.
- `POST` to create a product; `item_group_id` is required.
- `PUT` to update a product identified by `item_group_id`.
- `DELETE` to delete a product identified by `item_group_id`.
- `OPTIONS` for CORS preflight requests.

These are behaviors visible in the checked-in function source; they do not independently confirm that the function is deployed or reachable in a live environment.

### Users and orders

The frontend references the following endpoints:

- `/functions/v1/apple-users` for login and registration.
- `/functions/v1/apple-orders` for order creation and order retrieval.

The implementation files for these functions were not verified during this audit. Ensure that the functions exist, are deployed, and accept the request and response formats expected by the frontend before relying on authentication, checkout, or tracking in a live environment.

## Deployment

Build the static frontend with `npm run build` and deploy the generated `dist/` directory to a static hosting provider that supports the application.

Because the app uses React Router, configure the hosting provider to serve `index.html` for application routes such as `/shop`, `/profile`, `/checkout`, `/tracking`, and `/product/:id`. Otherwise, directly opening or refreshing a nested route may return a hosting-level 404.

The repository files reviewed for this README do not establish a specific production hosting provider or deployment pipeline. Configure the production `VITE_SUPABASE_URL` for the target environment and verify the backend functions separately.

## Validation

Run the production build to check that Vite can compile the frontend:

```bash
npm run build
```

The current `package.json` defines `dev`, `build`, and `preview` scripts. It does not define dedicated `test` or `lint` scripts, so no such commands are documented here.

## Known limitations

- Cart items, the signed-in user state, and the current order ID are held in React application state. Their persistence across a page refresh is not guaranteed by the code reviewed.
- The Home page selects its recommended products randomly from the loaded catalog; the selection is not a stable ranking.
- Some profile actions are currently presented as UI controls, but their full behavior was not verified.
- Live behavior depends on the backend endpoints being available and returning data in the formats expected by the frontend.
- Automated test and lint scripts are not defined in the current `package.json`.

## Security notes

- Never commit credentials, private keys, or service-role keys.
- Keep Supabase service-role credentials in server-side environment variables only. They must not be exposed through frontend code or `VITE_*` variables.
- Treat frontend validation as a user-experience aid, not as a security boundary. Validate permissions and sensitive operations on the backend.

## Contributing

Before proposing a change, confirm the intended behavior and keep documentation aligned with the current implementation. For changes to product, user, or order flows, verify both the frontend request and the corresponding backend contract. Include relevant verification results in the pull request description.

## Screenshots

Screenshots are not included yet because a suitable, verified screenshot asset was not identified during this audit. Add screenshots here when approved assets are available.
