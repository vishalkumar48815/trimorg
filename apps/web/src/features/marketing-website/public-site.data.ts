export interface PublicNavLink {
  label: string;
  to: string;
}

export interface PublicFooterColumn {
  title: string;
  links: PublicNavLink[];
}

export const PUBLIC_NAV_LINKS: PublicNavLink[] = [
  { label: 'Features', to: '/features' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'FAQ', to: '/#faq' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export const PUBLIC_FOOTER_COLUMNS: PublicFooterColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', to: '/features' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'FAQ', to: '/#faq' },
      { label: 'Login', to: '/login' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms & Conditions', to: '/terms' },
    ],
  },
  {
    title: 'Access',
    links: [
      { label: 'Get Started', to: '/signup' },
      { label: 'Forgot Password', to: '/forgot-password' },
      { label: 'Verify Email', to: '/verify-email' },
      { label: 'Reset Password', to: '/reset-password' },
    ],
  },
];
