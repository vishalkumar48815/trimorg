import type { ReactElement } from 'react';
import { PublicDocumentPage } from '@/features/marketing-website/public-document-page';
import { PublicSiteLayout } from '@/features/marketing-website/public-site-layout';

export function TermsConditionsPage(): ReactElement {
  return (
    <PublicSiteLayout>
      <PublicDocumentPage
        title="Terms & Conditions"
        description="Legally binding terms governing subscription access, software use, data ownership, and multi-region business operations on TrimOrg."
        sections={[
          {
            title: '1. Acceptance of Terms & Account Integrity',
            body: (
              <>
                <p>
                  By creating an account, accessing, or subscribing to the TrimOrg Business Operating System (BOS), you enter into a legally binding agreement between your commercial entity (&quot;Customer&quot;, &quot;Subscriber&quot;) and TrimOrg (&quot;Platform&quot;, &quot;we&quot;, &quot;us&quot;).
                </p>
                <p>
                  You warrant that you are legally authorized to represent your business entity, will maintain accurate commercial records, safeguard administrative credentials, and enforce granular role-based permissions across staff accounts.
                </p>
              </>
            ),
          },
          {
            title: '2. Subscriptions, 14-Day Trial & Billing Terms',
            body: (
              <>
                <p>
                  All new signups receive a 14-day full-access trial without upfront payment details. Following the trial, continued access requires selecting an active subscription tier (Starter, Growth, or Business) billed in advance on a recurring monthly or annual basis.
                </p>
                <p>
                  Subscription fees are non-refundable for partial billing months. You reserve the unconditional right to cancel your subscription at any time via company settings without cancellation penalties, retaining full platform access until the conclusion of your paid billing term.
                </p>
              </>
            ),
          },
          {
            title: '3. Multi-Region Compliance (India, US, UK, Australia & Global)',
            body: (
              <>
                <p>
                  TrimOrg provides multi-currency (INR ₹, USD $, EUR €, GBP £, AUD $) and regional tax calculation utilities (such as India GST [CGST/SGST/IGST], UK/EU VAT, and US/Australia Sales Tax) to streamline commercial invoicing and point-of-sale checkout.
                </p>
                <p className="font-semibold text-foreground">
                  Statutory Responsibility Disclaimer: TrimOrg functions as an automated administrative tool. The Customer retains sole legal and statutory responsibility for verifying tax rate applicability, submitting mandatory tax filings (e.g., GSTR-1, GSTR-3B, HMRC VAT, IRS reports), and remitting statutory duties to relevant government authorities.
                </p>
              </>
            ),
          },
          {
            title: '4. Service Availability, Offline Operation & SLA',
            body: (
              <>
                <p>
                  We target 99.99% cloud service availability. To safeguard counter operations against local ISP dropouts, TrimOrg incorporates localized browser caching allowing staff to process offline transactions and automatically sync records once network connectivity is restored.
                </p>
                <p>
                  Routine cloud maintenance is scheduled during off-peak hours with prior dashboard notifications to avoid disruption to physical store trading hours.
                </p>
              </>
            ),
          },
          {
            title: '5. Intellectual Property & Customer Data Ownership',
            body: (
              <>
                <p>
                  You retain 100% exclusive intellectual property and proprietary ownership of all uploaded product catalogs, customer databases, sales records, invoices, and financial ledger data.
                </p>
                <p>
                  TrimOrg retains all intellectual property rights, trademarks, and source code powering the software platform and its underlying APIs.
                </p>
              </>
            ),
          },
          {
            title: '6. Limitation of Liability & Indemnification',
            body: (
              <>
                <p>
                  To the maximum extent permitted by applicable law, TrimOrg and its officers, directors, and developers shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, inventory discrepancies, or third-party hardware failures (such as receipt printers or barcode scanners).
                </p>
                <p>
                  TrimOrg&apos;s total aggregate liability arising out of or related to these terms shall under no circumstances exceed the total subscription fees actually paid by the Customer in the preceding three (3) months.
                </p>
              </>
            ),
          },
          {
            title: '7. Governing Law & Dispute Resolution',
            body: (
              <>
                <p>
                  These Terms shall be governed by and construed in accordance with the commercial laws of the jurisdiction where TrimOrg is incorporated, without regard to its conflict of law principles. Any legal proceedings shall be resolved through binding arbitration or competent courts within said jurisdiction.
                </p>
              </>
            ),
          },
        ]}
      />
    </PublicSiteLayout>
  );
}
