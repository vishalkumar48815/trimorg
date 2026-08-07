interface LogoProps {
  collapsed?: boolean;
}

export function Logo({ collapsed = false }: LogoProps) {
  return (
    <div className="flex h-9 items-center gap-2 px-2 font-semibold text-foreground">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-sm text-primary-foreground">
        T
      </span>
      {!collapsed && <span className="truncate">Trimorg</span>}
    </div>
  );
}
