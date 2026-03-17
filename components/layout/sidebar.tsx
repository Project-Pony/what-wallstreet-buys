"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, KanbanSquare, LayoutGrid } from "lucide-react";
import type { ElementType } from "react";

import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { AppRole, AppUser } from "@/types/app";

const NAV_BY_ROLE: Record<AppRole, Array<{ href: string; label: string; icon: ElementType }>> =
  {
    business_owner: [
      { href: "/pipeline", label: "Pipeline", icon: KanbanSquare },
      { href: "/tracker", label: "Sales Tracker", icon: LayoutGrid }
    ],
    sales_manager: [
      { href: "/pipeline", label: "Pipeline", icon: KanbanSquare },
      { href: "/tasks", label: "My Tasks", icon: ClipboardList },
      { href: "/tracker", label: "Sales Tracker", icon: LayoutGrid }
    ],
    sales_executive: [{ href: "/tasks", label: "My Tasks", icon: ClipboardList }],
    rnd_manager: [{ href: "/tasks", label: "My Tasks", icon: ClipboardList }],
    packaging_manager: [{ href: "/tasks", label: "My Tasks", icon: ClipboardList }]
  };

interface SidebarProps {
  currentUser: AppUser | null;
  role: AppRole | null;
}

export function Sidebar({ currentUser, role }: SidebarProps) {
  const pathname = usePathname();
  const navItems = role ? NAV_BY_ROLE[role] : [];

  return (
    <aside className="hidden min-h-screen w-64 flex-col bg-sidebar px-5 py-5 text-sidebar-foreground lg:flex">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
            RA
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
              Internal Workflow
            </p>
            <h1 className="font-bold text-sm text-white truncate">Sales Operations</h1>
          </div>
        </div>
        {role ? (
          <Badge className="mt-3 bg-white/10 text-white" variant="neutral">
            {ROLE_LABELS[role]}
          </Badge>
        ) : null}
      </div>

      <nav className="mt-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                isActive
                  ? "bg-primary text-white shadow-lg shadow-blue-950/20"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
          Signed in
        </p>
        <p className="mt-1.5 text-sm font-bold text-white truncate">
          {currentUser?.fullName ?? "Guest"}
        </p>
        <p className="mt-0.5 text-xs text-slate-400 truncate">
          {currentUser?.email ?? "No active session"}
        </p>
      </div>
    </aside>
  );
}
