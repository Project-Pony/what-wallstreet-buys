"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Bell } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROLE_HOME_PATHS } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import { AppRole, NotificationItem } from "@/types/app";

interface NotificationBellProps {
  notifications: NotificationItem[];
  role: AppRole | null;
}

export function NotificationBell({ notifications, role }: NotificationBellProps) {
  const [open, setOpen] = useState(false);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications]
  );

  const targetPath = role
    ? role === "business_owner" || role === "sales_manager"
      ? ROLE_HOME_PATHS.sales_manager
      : ROLE_HOME_PATHS[role]
    : "/login";

  return (
    <div className="relative">
      <Button
        className="relative h-9 w-9 rounded-xl p-0"
        variant="secondary"
        onClick={() => setOpen((value) => !value)}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 ? (
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-primary" />
        ) : null}
      </Button>

      {open ? (
        <div className="absolute right-0 z-30 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-3 shadow-panel">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
              <p className="text-xs text-slate-500">Unread items</p>
            </div>
            <Badge variant={unreadCount > 0 ? "blue" : "neutral"}>
              {unreadCount}
            </Badge>
          </div>

          <div className="max-h-72 space-y-2 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="rounded-xl bg-slate-50 px-3 py-4 text-sm text-slate-500 text-center">
                No notifications right now.
              </p>
            ) : (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={`${targetPath}?lead=${notification.leadId}`}
                  className="block rounded-xl border border-slate-100 p-3 transition hover:border-slate-200 hover:bg-slate-50"
                  onClick={() => setOpen(false)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant={notification.isRead ? "neutral" : "blue"}>
                      {notification.isRead ? "Read" : "New"}
                    </Badge>
                    <span className="text-[10px] text-slate-400">
                      {formatDateTime(notification.createdAt)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium leading-5 text-slate-800 line-clamp-2">
                    {notification.message}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
