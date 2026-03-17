import { redirect } from "next/navigation";

import { SalesTrackerTable } from "@/components/dashboard/sales-tracker-table";
import { getRoleHomePath } from "@/lib/auth";
import { getDashboardSnapshot } from "@/lib/data/dashboard";
import { getTrackerRows } from "@/lib/dashboard";

export default async function TrackerPage() {
  const snapshot = await getDashboardSnapshot();

  if (!snapshot.role || !snapshot.currentUser) {
    redirect("/login");
  }

  if (!["business_owner", "sales_manager"].includes(snapshot.role)) {
    redirect(getRoleHomePath(snapshot.role));
  }

  const rows = getTrackerRows(snapshot);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-blue-600 font-medium">
          Sales Manager View
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950">
          Sales Tracker
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Monitor active leads, dispatch details, delivery expectations, and client
          approval status.
        </p>
      </div>

      <SalesTrackerTable rows={rows} />
    </div>
  );
}
