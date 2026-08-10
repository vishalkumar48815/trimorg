import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageContainer } from '@/shell/page-container';

interface DashboardSection {
  title: string;
}

const dashboardSections: DashboardSection[] = [
  { title: "Today's Sales" },
  { title: 'Pending Payments' },
  { title: 'Low Stock Alerts' },
  { title: 'Recent Orders' },
  { title: 'Top Selling Products' },
  { title: 'Quick Actions' },
];

export function DashboardPage() {
  return (
    <PageContainer width="full">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Dashboard
          </h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {dashboardSections.map((section) => (
            <Card key={section.title} className="min-h-44">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium text-foreground">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 items-center">
                <p className="text-sm font-medium text-muted-foreground">Coming Soon</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
