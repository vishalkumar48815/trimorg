import type { ReactElement } from 'react';
import { ArrowRight, Filter, LayoutGrid, Sparkles, Table2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { SectionCard } from '@/components/ui/section-card';
import {
  buttonVariants,
  inputExamples,
  tableColumns,
  tableRows,
  typographySamples,
} from '@/features/ui-preview/ui-preview.data';

function SkeletonBar({ className }: { className: string }): ReactElement {
  return <div className={`animate-pulse rounded-full bg-muted ${className}`} />;
}

export function UiPreviewPage(): ReactElement {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader
        eyebrow="UI Preview"
        title="Premium UI foundation"
        description="A reusable component system tuned for Trimorg's SaaS surfaces, with soft elevation, modern type, and subtle motion."
        actions={
          <>
            <Button variant="outline">Secondary action</Button>
            <Button>
              Primary action
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="Buttons"
          description="Primary, secondary, outline, ghost, danger, and link states."
          action={
            <Button size="sm" variant="ghost">
              <Filter className="h-4 w-4" aria-hidden="true" />
              Filters
            </Button>
          }
        >
          <div className="flex flex-wrap gap-3">
            {buttonVariants.map((item) => (
              <Button key={item.label} variant={item.variant}>
                {item.label}
              </Button>
            ))}
            <Button size="icon" variant="outline" aria-label="Icon button">
              <LayoutGrid className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </SectionCard>

        <SectionCard
          title="Inputs"
          description="A calm form style with better spacing, shadows, and focus rings."
        >
          <div className="grid gap-4">
            {inputExamples.map((field) => (
              <label
                key={field.id}
                className="grid gap-2 text-sm font-medium text-foreground"
                htmlFor={field.id}
              >
                {field.label}
                <Input
                  id={field.id}
                  type={
                    field.label === 'Password'
                      ? 'password'
                      : field.label === 'Email'
                        ? 'email'
                        : 'search'
                  }
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              </label>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="Cards"
          description="Large spacing, soft elevation, and minimal borders."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Surface card</CardTitle>
                <CardDescription>Clean container for app content.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-24 rounded-lg border border-border-subtle bg-surface-secondary" />
                <p className="text-sm text-muted-foreground">
                  The surface is quiet, rounded, and ready for dense business workflows.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Action card</CardTitle>
                <CardDescription>Designed for summary blocks and quick actions.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Button variant="outline" className="justify-start">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Enhance layout
                </Button>
                <Button variant="ghost" className="justify-start text-muted-foreground">
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Remove block
                </Button>
              </CardContent>
            </Card>
          </div>
        </SectionCard>

        <SectionCard
          title="Empty states"
          description="Friendly guidance when data has not been created yet."
        >
          <EmptyState
            icon={Table2}
            title="No records yet"
            description="Start by creating your first item to see the empty state transform into data."
            primaryAction={<Button>Create item</Button>}
            secondaryAction={<Button variant="outline">Learn more</Button>}
          />
        </SectionCard>
      </div>

      <SectionCard
        title="Tables"
        description="A premium data table with crisp alignment and no noise."
      >
        <div className="overflow-hidden rounded-lg border border-border shadow-[var(--shadow-raised)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-separate border-spacing-0">
              <thead>
                <tr className="bg-surface-secondary/60 text-left text-sm font-medium text-muted-foreground">
                  {tableColumns.map((column) => (
                    <th key={column} className="border-b border-border px-6 py-4">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((item) => (
                  <tr key={item.id} className="border-b border-border/70 text-sm last:border-b-0">
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4">{item.role}</td>
                    <td className="px-6 py-4">{item.status}</td>
                    <td className="px-6 py-4">{item.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Page headers" description="Reusable page chrome for product sections.">
          <Card className="border-border-subtle bg-surface-secondary/60">
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>
                Page headers keep title, description, and actions aligned.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <Button variant="outline">Export</Button>
              <Button>New product</Button>
            </CardContent>
          </Card>
        </SectionCard>

        <SectionCard
          title="Loading skeletons"
          description="Subtle placeholders that preserve rhythm."
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <SkeletonBar className="h-4 w-28" />
              <SkeletonBar className="h-8 w-3/4" />
              <SkeletonBar className="h-4 w-2/3" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <SkeletonBar className="h-28 rounded-lg" />
              <SkeletonBar className="h-28 rounded-lg" />
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Typography"
        description="Type scale, hierarchy, and comfortable reading rhythm."
      >
        <div className="space-y-5">
          {typographySamples.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="flex items-start gap-4">
                <div className="flex size-10 items-center justify-center rounded-md bg-surface-secondary text-muted-foreground">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className={item.className}>
                    Premium typography keeps hierarchy strong without becoming loud.
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </main>
  );
}
