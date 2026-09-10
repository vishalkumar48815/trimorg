import type { ReactElement } from 'react';
import { PublicDocumentPage } from '@/features/marketing-website/public-document-page';
import { PublicSiteLayout } from '@/features/marketing-website/public-site-layout';

export function PrivacyPolicyPage(): ReactElement {
  return (
    <PublicSiteLayout>
      <PublicDocumentPage
        title="Privacy Policy"
        description="Comprehensive data protection, encryption architecture, and privacy governance for TrimOrg users globally."
        sections={[
          {
            title: '1. Information We Collect & Scope',
            body: (
              <>
                <p>
                  To deliver our multi-tenant Business Operating System (BOS), TrimOrg processes: (a) Account identity records (name, business email, mobile phone, store details); (b) Billing metadata (selected tier, transaction receipts); (c) Customer operations records (product inventory, pricing catalogs, customer contact records, and sales invoices).
                </p>
                <p>
                  Payment Card Security: We do not process or store raw credit/debit card numbers on our infrastructure. All payment processing is delegated to PCI-DSS Level 1 certified gateways (Razorpay in India, Stripe internationally).
                </p>
              </>
            ),
          },
          {
            title: '2. Zero-Monetization & Strict Data Isolation Guarantee',
            body: (
              <>
                <p className="font-semibold text-foreground">
                  Zero Monetization Policy: TrimOrg will never sell, rent, license, or monetize your customer databases, inventory quantities, purchase orders, or sales transactions to any third party, aggregator, or advertiser under any circumstances.
                </p>
                <p>
                  Multi-Tenant Isolation: Every organization workspace operates in strict tenant-isolated logical boundaries backed by foreign-key enforcement and authorization guards at the API and database levels.
                </p>
              </>
            ),
          },
          {
            title: '3. Technical Security & Encryption Standards',
            body: (
              <>
                <p>
                  Data in Transit: All incoming and outgoing data transmissions are encrypted using Transport Layer Security (TLS 1.3) with HSTS enforcement.
                </p>
                <p>
                  Data at Rest: All core database volumes, audit logs, and backups are encrypted using military-grade 256-bit Advanced Encryption Standard (AES-256). Password credentials are hashed using salted cryptographic algorithms (bcrypt / Argon2).
                </p>
              </>
            ),
          },
          {
            title: '4. International Data Privacy (GDPR, India DPDP & CCPA Alignment)',
            body: (
              <>
                <p>
                  We comply with applicable global privacy frameworks including India&apos;s Digital Personal Data Protection Act (DPDP), the European Union General Data Protection Regulation (GDPR), and the California Consumer Privacy Act (CCPA).
                </p>
                <p>
                  Subscribers retain the Right of Access, Right to Rectification, Right to Data Portability, and the Right to Erasure for any customer contact information stored within their tenant workspace.
                </p>
              </>
            ),
          },
          {
            title: '5. Unconditional Data Portability & Export Rights',
            body: (
              <>
                <p>
                  You own 100% of your business data. TrimOrg provides unrestricted, automated export utilities allowing you to download your full product catalogs, customer transaction ledgers, inventory movements, and GST/VAT sales tax records in CSV, Excel, or PDF format at any time.
                </p>
              </>
            ),
          },
          {
            title: '6. Retention & Permanent Account Erasure',
            body: (
              <>
                <p>
                  Your business records remain safely stored for the duration of your active subscription. Upon explicit account termination or formal erasure request, your proprietary database records are purged in accordance with standard automated backup rotation lifecycles.
                </p>
              </>
            ),
          },
        ]}
      />
    </PublicSiteLayout>
  );
}
