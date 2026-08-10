import type { ReactElement } from 'react';
import { PublicDocumentPage } from '@/features/marketing-website/public-document-page';
import { PublicSiteLayout } from '@/features/marketing-website/public-site-layout';

export function TermsConditionsPage(): ReactElement {
  return (
    <PublicSiteLayout>
      <PublicDocumentPage
        title="Terms & Conditions"
        description="A premium, layout-only terms page ready for final legal copy."
        sections={[
          {
            title: 'Using Trimorg',
            body: (
              <>
                <p>
                  Trimorg is a business operating system intended to support wholesale and
                  distribution workflows.
                </p>
                <p>
                  Final access rules and account obligations will be defined before launch.
                </p>
              </>
            ),
          },
          {
            title: 'Account responsibility',
            body: (
              <>
                <p>
                  Users are expected to keep their account access secure and use the workspace in
                  line with the finalized product policies.
                </p>
                <p>
                  This page preserves the structure for those terms without inventing legal text.
                </p>
              </>
            ),
          },
          {
            title: 'Service changes',
            body: (
              <>
                <p>
                  Trimorg may change features and product structure as the platform evolves.
                </p>
                <p>
                  The final terms will define how those changes are handled for customers.
                </p>
              </>
            ),
          },
        ]}
      />
    </PublicSiteLayout>
  );
}
