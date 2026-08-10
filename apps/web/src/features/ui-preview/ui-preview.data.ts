import { BarChart3, Boxes, CheckCircle2, Sparkles, Type } from 'lucide-react';

export const buttonVariants = [
  { label: 'Primary', variant: 'default' as const },
  { label: 'Secondary', variant: 'secondary' as const },
  { label: 'Outline', variant: 'outline' as const },
  { label: 'Ghost', variant: 'ghost' as const },
  { label: 'Danger', variant: 'destructive' as const },
  { label: 'Link', variant: 'link' as const },
];

export const inputExamples = [
  { id: 'preview-search', label: 'Search' },
  { id: 'preview-email', label: 'Email' },
  { id: 'preview-password', label: 'Password' },
];

export const tableColumns = ['Name', 'Role', 'Status', 'Email'] as const;

export const tableRows = [
  {
    id: '1',
    name: 'Kate Moore',
    role: 'CEO',
    status: 'Active',
    email: 'kate@acme.com',
  },
  {
    id: '2',
    name: 'John Smith',
    role: 'CTO',
    status: 'Active',
    email: 'john@acme.com',
  },
  {
    id: '3',
    name: 'Sara Johnson',
    role: 'CMO',
    status: 'On Leave',
    email: 'sara@acme.com',
  },
] as const;

export const typographySamples = [
  { label: 'Display', className: 'text-5xl font-semibold tracking-tight sm:text-6xl', icon: Type },
  { label: 'Heading', className: 'text-3xl font-semibold tracking-tight sm:text-4xl', icon: Sparkles },
  { label: 'Section', className: 'text-2xl font-semibold tracking-tight', icon: Boxes },
  { label: 'Body', className: 'text-base leading-7 text-muted-foreground', icon: BarChart3 },
  { label: 'Caption', className: 'text-sm text-muted-foreground', icon: CheckCircle2 },
];
