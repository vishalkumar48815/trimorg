# Sprint 01 — Core Commerce & Sales Engine

> **Sprint Goal:** Complete the end-to-end Sales & POS billing workflow — enabling a business user to select products/services, assign/create a customer, apply discounts and taxes, complete a transaction with atomic inventory updates, and print/view a clean receipt.

---

## 1. Sprint Scope & Epics

1. **Epic 1: Database Schema Expansion**
   - Update Prisma schema to support `Product.isService`, `Product.taxRate`, `Product.unitType`, `Customer.vehicleDetails`, and complete `Sale` / `SaleItem` models.
   - Run Prisma migration and regenerate Prisma Client.

2. **Epic 2: Customer Management Module (CRM)**
   - Backend `CustomersModule` in NestJS with search, list, get, create, update endpoints.
   - Frontend customer search and quick-create customer modal inside POS checkout.
   - Frontend Customer directory page (`/business/customers`).

3. **Epic 3: Sales & POS Backend Engine**
   - Backend `SalesModule` in NestJS with strict Zod validation.
   - Atomic transaction handling: On completing a sale, automatically reduce stock for physical products while skipping service/labor items.
   - Endpoints: `POST /sales` (Create & Checkout), `GET /sales` (List sales with pagination and filters), `GET /sales/:id` (Invoice details).

4. **Epic 4: POS & Billing User Interface**
   - Wire `NewSalePage` into routing under `/sales/pos` and update navigation sidebar.
   - Live cart calculations: Subtotal, Discount (amount/percent), Tax (GST), Grand Total.
   - Customer attachment & vehicle notes input (e.g. for EV repair bills).
   - Payment method toggle (`CASH`, `UPI`, `CARD`, `CREDIT`).

5. **Epic 5: Receipt Preview & Thermal Print**
   - Modal preview of generated invoice with store branding, GSTIN, customer details, itemized breakdown, and totals.
   - Dedicated print stylesheet supporting 80mm POS thermal receipt and standard A4 invoice layouts.

---

## 2. User Stories & Acceptance Criteria

### Story 1: POS Billing with Hybrid Items

- **As a** store cashier or workshop manager,
- **I want to** add both physical spare parts (e.g. brake pads) and labor charges (e.g. general service) to the cart,
- **So that** I can bill the customer on a single unified invoice.
- **Acceptance Criteria:**
  - Physical products enforce available stock limits in the UI and backend.
  - Service items can be added with unrestricted quantity without stock checks.
  - On checkout, only physical product stocks are decremented in the database.

### Story 2: Instant Customer Search & Quick Add

- **As a** cashier during a busy checkout,
- **I want to** search for an existing customer by phone number or quickly create a new one without leaving the POS screen,
- **So that** the checkout process remains fast and uninterrupted.
- **Acceptance Criteria:**
  - Phone number lookup suggests matching customers with 300ms debounce.
  - "New Customer" quick modal accepts Name, Phone, and optional Vehicle Info.
  - Newly created customer is immediately selected in the active cart.

### Story 3: Clean Receipt & Print Output

- **As a** customer and store owner,
- **I want to** view and print a clear invoice receipt upon completing the sale,
- **So that** the customer receives proof of purchase and warranty details.
- **Acceptance Criteria:**
  - Shows organization name, address, GSTIN, invoice number, and timestamp.
  - Lists items, unit price, quantity, tax, discount, and grand total.
  - Responsive print layout triggers standard browser `window.print()` cleanly.

---

## 3. Definition of Done (DoD) for Sprint 01

- [ ] Prisma schema updated, migrated, and typed.
- [ ] Backend controllers and services covered with unit tests.
- [ ] API endpoints protected by `AuthGuard` and strictly scoped by `organizationId`.
- [ ] Frontend UI conforms to [`DesignSystem.md`](file:///Users/vishalkumar/trimorg/docs/DesignSystem.md) (tokens, 4px grid, neutral palette, keyboard access).
- [ ] No `any` types; `pnpm run typecheck` and `pnpm run lint` pass with zero warnings/errors.
- [ ] Verified end-to-end in browser with real database records.
