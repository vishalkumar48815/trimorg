import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/shell/logo';
import { SidebarNav } from '@/shell/sidebar-nav';
import { useSidebarCollapsed } from '@/shell/use-sidebar-collapsed';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const [collapsed, setCollapsed] = useSidebarCollapsed();

  return (
    // A plain div, not <aside>: the <nav> below already provides the "navigation"
    // landmark, and this region is primary navigation, not complementary content.
    <div
      className={cn(
        'hidden shrink-0 flex-col border-r border-border bg-card md:flex',
        'transition-[width] duration-200 ease-out motion-reduce:transition-none',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className="flex h-14 items-center px-2">
        <Logo collapsed={collapsed} />
      </div>
      <Separator />
      <div className="flex-1 overflow-y-auto py-3">
        <SidebarNav collapsed={collapsed} onRequestExpand={() => setCollapsed(false)} />
      </div>
      <Separator />
      <div className="p-2">
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="flex h-9 w-full items-center justify-center gap-2 rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
          )}
          {!collapsed && <span className="text-sm">Collapse</span>}
        </button>
      </div>
    </div>
  );
}
