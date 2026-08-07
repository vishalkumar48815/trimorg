import { ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { cn } from '@/lib/utils';
import { navigationConfig, type NavItem } from '@/shell/navigation.config';

function findTrail(items: NavItem[], pathname: string, trail: NavItem[] = []): NavItem[] | null {
  for (const item of items) {
    const nextTrail = [...trail, item];
    if (item.path === pathname) return nextTrail;
    if (item.children) {
      const found = findTrail(item.children, pathname, nextTrail);
      if (found) return found;
    }
  }
  return null;
}

export function Breadcrumb() {
  const { pathname } = useLocation();
  const trail = findTrail(navigationConfig, pathname) ?? [];

  if (trail.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={item.id} className="flex min-w-0 items-center gap-1.5">
              {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
              {isLast || !item.path ? (
                <span
                  className={cn('truncate', isLast && 'font-medium text-foreground')}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.title}
                </span>
              ) : (
                <Link to={item.path} className="truncate hover:text-foreground">
                  {item.title}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
