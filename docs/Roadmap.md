# TrimOrg — Engineering & Product Roadmap

> **Target Architecture:** Multi-Tenant Modular Monolith (NestJS + Prisma + PostgreSQL + React 19 + Tailwind v4)  
> **Approach:** Incremental delivery with automated testing, static typing, and end-to-end verification at every phase.

---

## Roadmap Overview

```
Phase 1: Architecture, Vision & Database Blueprints (Current)
   │
Phase 2: Sales, POS & Checkout Engine (Core Revenue Loop)
   │
Phase 3: Customer Management (CRM & Vehicle Records)
   │
Phase 4: Real-Time Inventory, Stock Movements & Low-Stock Alerts
   │
Phase 5: Procurement, Suppliers & Goods Received Notes (GRN)
   │
Phase 6: Invoicing, Quotations & Print/PDF Receipts
   │
Phase 7: Real-Time Executive Dashboard & Financial / Tax Reports
   │
Phase 8: Team Collaboration, RBAC & Store Settings
```

---

## Detailed Phase Breakdown

### Phase 1: Architecture, Vision & Database Blueprints

- [x] Comprehensive product strategy defined in [`Vision.md`](file:///Users/vishalkumar/trimorg/docs/Vision.md).
- [x] Multi-tenant database schema & ERD specified in [`Database.md`](file:///Users/vishalkumar/trimorg/docs/Database.md).
- [x] Roadmap & sprint breakdown established in [`Roadmap.md`](file:///Users/vishalkumar/trimorg/docs/Roadmap.md) & [`Sprint01.md`](file:///Users/vishalkumar/trimorg/docs/Sprint01.md).

---

### Phase 2: Sales, POS & Checkout Engine

_Objective: Enable staff to quickly create sales, add physical or service items, select customers, process payments, and automatically adjust inventory stock._

- **Backend (`apps/api`):**
  - Update `schema.prisma` with `Sale`, `SaleItem`, and `Product.isService` support; run migrations.
  - Implement `SalesModule` (Controller, Service, Zod DTOs, Type definitions).
  - Implement atomic transactions: Creating a completed sale atomically decrements stock for physical items (bypassing service items).
- **Frontend (`apps/web`):**
  - Wire `NewSalePage` into routing under `/sales/pos` and update navigation.
  - Implement live checkout panel with Subtotal, Discount, Tax (GST), and Grand Total calculation.
  - Implement payment method selector (`CASH`, `UPI`, `CARD`, `CREDIT`).
  - Implement clean, printable thermal/standard receipt preview modal.

---

### Phase 3: Customer Management (CRM & Vehicle Tracking)

_Objective: Maintain customer master records, purchase history, and vehicle metadata for sales and workshop servicing._

- **Backend (`apps/api`):**
  - Build `CustomersModule` (CRUD, search by phone/name, customer sales history).
- **Frontend (`apps/web`):**
  - Build `/business/customers` directory table with search, filters, and pagination.
  - Build "Add/Edit Customer" drawer with name, mobile, email, GSTIN, and vehicle details.
  - Build quick-create customer modal inside the POS checkout sheet.

---

### Phase 4: Real-Time Inventory, Stock Audit & Low-Stock Alerts

_Objective: Track warehouse stock counts, record every stock movement reason, and trigger proactive reorder alerts._

- **Backend (`apps/api`):**
  - Implement `StockMovement` logging on sales, purchases, and manual adjustments.
  - Implement stock adjustment endpoints (`POST /inventory/adjust`).
- **Frontend (`apps/web`):**
  - Build `/business/inventory` dashboard page.
  - Add visual stock status indicators (`In Stock`, `Low Stock`, `Out of Stock`).
  - Add "Adjust Stock" drawer with audit reason selector (`Damage`, `Physical Count Discrepancy`, `Restock`).
  - Add Stock Movement Audit History tab.

---

### Phase 5: Procurement, Suppliers & Goods Received (GRN)

_Objective: Streamline purchasing from manufacturers and parts distributors with automated inventory increment._

- **Backend (`apps/api`):**
  - Build `SuppliersModule` (CRUD, contact details, balance payable).
  - Build `PurchasesModule` (Create PO, Mark Received, Auto-increment stock in transaction).
- **Frontend (`apps/web`):**
  - Build `/business/suppliers` supplier directory.
  - Build `/purchases/purchase-orders` (Create and view POs).
  - Build `/purchases/goods-received` (Receive stock and update inventory in one click).

---

### Phase 6: Invoicing, Quotations & Print/PDF Receipts

_Objective: Manage formal B2B invoices, customer estimates/quotations, and order fulfillment states._

- **Backend & Frontend:**
  - Build `/sales/quotations` (Create estimate, convert quotation to invoice with one click).
  - Build `/sales/invoices` (List invoices, filter by status `DRAFT`, `COMPLETED`, `CANCELLED`).
  - Clean A4 & 80mm POS thermal print CSS layout.

---

### Phase 7: Real-Time Executive Dashboard & Financial Reports

_Objective: Provide actionable intelligence and tax compliance exports for business owners._

- **Backend:**
  - Build `DashboardService` with cached metrics: Today's Revenue, Orders Count, Low-Stock items count, Top Selling Products, Recent Sales.
  - Build `ReportsService` generating aggregated summaries for date ranges.
- **Frontend:**
  - Replace dashboard placeholder cards with live data cards and interactive revenue charts.
  - Build `/reports/sales` (Revenue by day, month, category, payment method).
  - Build `/reports/inventory` (Stock valuation, fast/slow moving items).
  - Export reports to CSV/Excel.

---

### Phase 8: Team Collaboration, RBAC & Store Preferences

_Objective: Support multi-staff organizations with role-based restrictions and multi-currency/tax customization._

- **Backend:**
  - Invite staff via email, assign roles (`OWNER`, `ADMIN`, `STAFF`).
  - Role-based route guards in NestJS.
- **Frontend:**
  - Build `/settings/users` and `/settings/roles`.
  - Build `/settings/company` (GST, invoice prefix, logo upload, thermal printer width preference).
