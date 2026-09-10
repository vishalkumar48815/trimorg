import { Check, X, Shield, Users, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageContainer } from '@/shell/page-container';

interface PermissionRow {
  category: string;
  action: string;
  owner: boolean;
  admin: boolean;
  staff: boolean;
}

const permissionsData: PermissionRow[] = [
  // Sales & POS
  { category: 'Sales & POS', action: 'Create POS Invoices & Receipts', owner: true, admin: true, staff: true },
  { category: 'Sales & POS', action: 'Create Quotations & Estimates', owner: true, admin: true, staff: true },
  { category: 'Sales & POS', action: 'Convert Quotations to Invoices', owner: true, admin: true, staff: true },
  { category: 'Sales & POS', action: 'Cancel / Void Completed Invoices', owner: true, admin: true, staff: false },

  // Customers
  { category: 'Customers & CRM', action: 'View Customer Directory & History', owner: true, admin: true, staff: true },
  { category: 'Customers & CRM', action: 'Add & Edit Customer Records', owner: true, admin: true, staff: true },
  { category: 'Customers & CRM', action: 'Export Customer Data', owner: true, admin: true, staff: false },

  // Inventory & Stock
  { category: 'Inventory', action: 'View Real-time Stock Levels & Catalog', owner: true, admin: true, staff: true },
  { category: 'Inventory', action: 'Create / Update Products & Categories', owner: true, admin: true, staff: false },
  { category: 'Inventory', action: 'Perform Manual Stock Adjustments', owner: true, admin: true, staff: false },
  { category: 'Inventory', action: 'View Stock Movement Audit Logs', owner: true, admin: true, staff: false },

  // Procurement & Suppliers
  { category: 'Procurement', action: 'View Suppliers & Balances', owner: true, admin: true, staff: false },
  { category: 'Procurement', action: 'Create Purchase Orders (PO)', owner: true, admin: true, staff: false },
  { category: 'Procurement', action: 'Receive Stock Intake (GRN)', owner: true, admin: true, staff: true },

  // Reports & Analytics
  { category: 'Reports & Intelligence', action: 'View Executive Dashboard', owner: true, admin: true, staff: false },
  { category: 'Reports & Intelligence', action: 'View Sales & Financial Reports', owner: true, admin: true, staff: false },
  { category: 'Reports & Intelligence', action: 'View Inventory Valuation Reports', owner: true, admin: true, staff: false },
  { category: 'Reports & Intelligence', action: 'Export Accounting & Tax CSVs', owner: true, admin: true, staff: false },

  // Team & Settings
  { category: 'Settings & Administration', action: 'Manage Store Profile & Preferences', owner: true, admin: false, staff: false },
  { category: 'Settings & Administration', action: 'Invite & Manage Team Staff', owner: true, admin: true, staff: false },
  { category: 'Settings & Administration', action: 'Assign / Modify Staff Roles', owner: true, admin: false, staff: false },
];

export function RolesPage() {
  return (
    <PageContainer width="full">
      <div className="flex flex-col gap-6 pb-12">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Roles & Permissions Matrix
          </h1>
          <p className="text-sm text-muted-foreground">
            Role-based access control (RBAC) definitions and operational boundaries across TrimOrg.
          </p>
        </div>

        {/* 3 Role Definition Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Owner */}
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-base font-bold text-foreground">Store Owner</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>Full root access to all store modules, financial accounting, company settings, and team hierarchy.</p>
              <div className="font-semibold text-amber-600 dark:text-amber-400">Total System Control</div>
            </CardContent>
          </Card>

          {/* Admin */}
          <Card className="border-purple-500/30 bg-purple-500/5">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-purple-500" />
                <CardTitle className="text-base font-bold text-foreground">Administrator</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>Manages daily operations, stock valuation, supplier purchasing, financial reports, and onboards staff.</p>
              <div className="font-semibold text-purple-600 dark:text-purple-400">Operations & Reporting</div>
            </CardContent>
          </Card>

          {/* Staff */}
          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-base font-bold text-foreground">Store Staff</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>Handles front-desk POS billing, estimates, customer vehicle lookup, and physical goods receipt intake.</p>
              <div className="font-semibold text-blue-600 dark:text-blue-400">Front-desk & POS</div>
            </CardContent>
          </Card>
        </div>

        {/* Permissions Table */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Module Access Matrix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground uppercase">
                    <th className="py-3 px-3 w-1/3">Feature / Capability</th>
                    <th className="py-3 px-3 w-1/4">Category</th>
                    <th className="py-3 px-3 text-center">Owner</th>
                    <th className="py-3 px-3 text-center">Admin</th>
                    <th className="py-3 px-3 text-center">Staff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {permissionsData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-3 font-medium text-foreground">{row.action}</td>
                      <td className="py-3 px-3 text-xs text-muted-foreground">{row.category}</td>
                      <td className="py-3 px-3 text-center">
                        {row.owner ? (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                        ) : (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <X className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {row.admin ? (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                        ) : (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <X className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {row.staff ? (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                        ) : (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <X className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
