import { redirect } from "next/navigation";

import { LeadDetailPanel } from "@/components/dashboard/lead-detail-panel";
import { PipelineBoard } from "@/components/dashboard/pipeline-board";
import { getRoleHomePath } from "@/lib/auth";
import { getDashboardSnapshot } from "@/lib/data/dashboard";
import { getLeadBundle } from "@/lib/dashboard";

interface PipelinePageProps {
  searchParams?: {
    lead?: string;
  };
}

export default async function PipelinePage({ searchParams }: PipelinePageProps) {
  const snapshot = await getDashboardSnapshot();

  if (!snapshot.role || !snapshot.currentUser) {
    redirect("/login");
  }

  if (!["business_owner", "sales_manager"].includes(snapshot.role)) {
    redirect(getRoleHomePath(snapshot.role));
  }

  const selectedLeadId = searchParams?.lead;
  const selectedBundle = selectedLeadId
    ? getLeadBundle(snapshot, selectedLeadId)
    : null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-blue-600 font-medium">
          Main View
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950">
          Pipeline Board
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Track lead intake, parallel briefing and approvals, sample preparation,
          dispatch, and final client approval.
        </p>
      </div>

      <PipelineBoard basePath="/pipeline" role={snapshot.role} snapshot={snapshot} />

      {selectedBundle ? (
        <LeadDetailPanel
          basePath="/pipeline"
          bundle={selectedBundle}
          isDemo={snapshot.isDemo}
          role={snapshot.role}
          users={snapshot.users.length > 0 ? snapshot.users : snapshot.currentUser ? [snapshot.currentUser] : []}
        />
      ) : null}
    </div>
  );
}
