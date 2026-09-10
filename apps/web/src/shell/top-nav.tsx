import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/user-menu/user-menu';
import { Breadcrumb } from '@/shell/breadcrumb';
import { ThemeToggle } from '@/shell/theme-toggle';

interface TopNavProps {
  onOpenMobileDrawer: () => void;
}

export function TopNav({ onOpenMobileDrawer }: TopNavProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
      <Button
        type="button"
        variant="ghost"
        size="icon-lg"
        className="md:hidden"
        aria-label="Open navigation menu"
        onClick={onOpenMobileDrawer}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </Button>
      <Breadcrumb />
      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
