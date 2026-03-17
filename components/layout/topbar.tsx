import { AppRole, AppUser, NotificationItem } from "@/types/app";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS } from "@/lib/constants";
import { NotificationBell } from "@/components/layout/notification-bell";
import { LogoutButton } from "@/components/layout/logout-button";

interface TopbarProps {
  currentUser: AppUser | null;
  role: AppRole | null;
  notifications: NotificationItem[];
  isDemo: boolean;
}

export function Topbar({
  currentUser,
  role,
  notifications,
  isDemo
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur-md lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
            Sales Sampling Process
          </p>
          <h2 className="mt-0.5 text-lg font-bold text-slate-950 truncate">
            Welcome back{currentUser ? `, ${currentUser.fullName.split(" ")[0]}` : ""}
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {isDemo ? (
            <Badge variant="yellow">Demo</Badge>
          ) : null}
          {role ? <Badge className="hidden sm:inline-flex" variant="blue">{ROLE_LABELS[role]}</Badge> : null}
          <NotificationBell notifications={notifications} role={role} />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
