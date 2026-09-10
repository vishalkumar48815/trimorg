import type { ReactElement } from 'react';
import { ChevronDown, KeyRound, LogOut, Settings, User, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/features/auth/auth-context';

function getInitials(fullName: string | undefined): string {
  if (!fullName) return '';

  const [first, second] = fullName.trim().split(/\s+/);
  return `${first?.[0] ?? ''}${second?.[0] ?? ''}`.toUpperCase();
}

export function UserMenu(): ReactElement {
  const navigate = useNavigate();
  const { session, logoutUser } = useAuth();
  const initials = getInitials(session?.user.fullName);

  const handleSignOut = async () => {
    await logoutUser();
    navigate('/login', { replace: true });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-md px-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Avatar className="h-7 w-7">
            <AvatarFallback>
              {initials || <User className="h-4 w-4" aria-hidden="true" />}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">Open user menu</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">
          {session?.user.fullName ?? 'Account'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate('/account/profile')}>
          <UserRound className="h-4 w-4" aria-hidden="true" />
          My Profile
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate('/account/business')}>
          <Settings className="h-4 w-4" aria-hidden="true" />
          Business Settings
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate('/account/change-password')}>
          <KeyRound className="h-4 w-4" aria-hidden="true" />
          Change Password
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void handleSignOut()}>
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
