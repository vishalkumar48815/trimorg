import type { ReactElement } from 'react';
import { PublicDocumentPage } from '@/features/marketing-website/public-document-page';
import { PublicSiteLayout } from '@/features/marketing-website/public-site-layout';

export function PrivacyPolicyPage(): ReactElement {
  return (
    <PublicSiteLayout>
      <PublicDocumentPage
        title="Privacy Policy"
        description="A clear, layout-only privacy policy page for Trimorg."
        sections={[
          {
            title: 'Information we collect',
            body: (
              <>
                <p>
                  Trimorg would collect the information needed to create and support a business
                  workspace, such as account details, business profile data, and usage information.
                </p>
                <p>
                  This page is a structure placeholder and does not include legal commitments yet.
                </p>
              </>
            ),
          },
          {
            title: 'How we use information',
            body: (
              <>
                <p>
                  Any future implementation would use information to operate the product, provide
                  support, and improve the user experience.
                </p>
                <p>
                  The final policy text will be reviewed before launch.
                </p>
              </>
            ),
          },
          {
            title: 'Your controls',
            body: (
              <>
                <p>
                  The privacy page is laid out to support eventual settings around access, export,
                  and account management.
                </p>
                <p>Specific controls will be added when the product and legal review are ready.</p>
              </>
            ),
          },
        ]}
      />
    </PublicSiteLayout>
  );
}
