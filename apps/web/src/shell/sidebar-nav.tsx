import { NavLink, useLocation } from 'react-router';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { navigationConfig, type NavItem } from '@/shell/navigation.config';

const groupIds = navigationConfig.filter((item) => item.children).map((item) => item.id);

function isDescendantActive(item: NavItem, pathname: string): boolean {
  if (item.path === pathname) return true;
  return item.children?.some((child) => isDescendantActive(child, pathname)) ?? false;
}

interface SidebarNavProps {
  /** Icon-only rail mode. Only meaningful for the persistent desktop sidebar. */
  collapsed?: boolean;
  /** Called after a leaf item is activated — used by the mobile drawer to close itself. */
  onNavigate?: () => void;
  /** Called when a group is clicked while collapsed, to bring the sidebar back to full width. */
  onRequestExpand?: () => void;
}

export function SidebarNav({ collapsed = false, onNavigate, onRequestExpand }: SidebarNavProps) {
  const { pathname } = useLocation();

  if (collapsed) {
    return (
      <nav aria-label="Primary" className="flex flex-col items-center gap-1 px-2">
        {navigationConfig.map((item) => (
          <CollapsedNavEntry
            key={item.id}
            item={item}
            active={isDescendantActive(item, pathname)}
            onRequestExpand={onRequestExpand}
          />
        ))}
      </nav>
    );
  }

  return (
    <nav aria-label="Primary" className="px-2">
      <Accordion type="multiple" defaultValue={groupIds} className="w-full">
        {navigationConfig.map((item) =>
          item.children ? (
            <AccordionItem key={item.id} value={item.id} className="border-none">
              <AccordionTrigger className="rounded-md px-2 py-2 text-sm font-medium text-foreground hover:bg-accent hover:no-underline">
                <span className="flex items-center gap-2">
                  {item.icon && <item.icon className="h-4 w-4" aria-hidden="true" />}
                  {item.title}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-1 pl-4">
                <ul className="flex flex-col gap-0.5">
                  {item.children.map((child) => (
                    <li key={child.id}>
                      <NavItemLink item={child} onNavigate={onNavigate} />
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ) : (
            <div key={item.id} className="py-0.5">
              <NavItemLink item={item} onNavigate={onNavigate} />
            </div>
          ),
        )}
      </Accordion>
    </nav>
  );
}

function NavItemLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  if (!item.path) return null;
  return (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isActive && 'bg-secondary font-medium text-secondary-foreground',
        )
      }
    >
      {item.icon && <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
      <span className="truncate">{item.title}</span>
    </NavLink>
  );
}

function CollapsedNavEntry({
  item,
  active,
  onRequestExpand,
}: {
  item: NavItem;
  active: boolean;
  onRequestExpand?: () => void;
}) {
  const Icon = item.icon;
  const iconButtonClass = cn(
    'flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors',
    'hover:bg-accent hover:text-accent-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    active && 'bg-secondary text-secondary-foreground',
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {item.path ? (
          <NavLink to={item.path} className={iconButtonClass}>
            {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
            <span className="sr-only">{item.title}</span>
          </NavLink>
        ) : (
          <button type="button" onClick={onRequestExpand} className={iconButtonClass}>
            {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
            <span className="sr-only">{item.title}</span>
          </button>
        )}
      </TooltipTrigger>
      <TooltipContent side="right">{item.title}</TooltipContent>
    </Tooltip>
  );
}
