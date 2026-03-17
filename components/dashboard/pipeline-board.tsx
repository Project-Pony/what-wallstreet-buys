import { Clock3, PackageCheck, ShieldAlert } from "lucide-react";

import { getBusinessOwnerStats, getLeadParallelTracks } from "@/lib/dashboard";
import { LeadCard } from "@/components/dashboard/lead-card";
import { Badge } from "@/components/ui/badge";
import { STAGE_GROUPS } from "@/lib/constants";
import { groupLeadsByStageGroup, canViewClientInfo, getActiveStageLog } from "@/lib/utils";
import { AppRole, DashboardSnapshot } from "@/types/app";

interface PipelineBoardProps {
  snapshot: DashboardSnapshot;
  role: AppRole | null;
  basePath: string;
}

export function PipelineBoard({
  snapshot,
  role,
  basePath
}: PipelineBoardProps) {
  const groupedLeads = groupLeadsByStageGroup(snapshot.leads);
  const showClientName = canViewClientInfo(role);
  const stats = getBusinessOwnerStats(snapshot);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Clock3 className="h-5 w-5 text-blue-600" />
            <p className="text-sm font-medium text-slate-500">Active Leads</p>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-950">
            {stats.activeLeads}
          </p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <PackageCheck className="h-5 w-5 text-amber-600" />
            <p className="text-sm font-medium text-amber-700">
              Awaiting Approval
            </p>
          </div>
          <p className="mt-3 text-2xl font-bold text-amber-900">
            {stats.awaitingApprovalCount}
          </p>
        </div>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-red-600" />
            <p className="text-sm font-medium text-red-700">SLA Breaches Today</p>
          </div>
          <p className="mt-3 text-2xl font-bold text-red-900">
            {stats.slaBreachesToday}
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <PackageCheck className="h-5 w-5 text-emerald-600" />
            <p className="text-sm font-medium text-emerald-700">
              Dispatched This Month
            </p>
          </div>
          <p className="mt-3 text-2xl font-bold text-emerald-900">
            {stats.samplesDispatchedThisMonth}
          </p>
        </div>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory">
        {STAGE_GROUPS.map((group) => (
          <section
            key={group}
            className="w-[320px] min-w-[320px] flex-shrink-0 snap-start rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-4"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-900 truncate">{group}</h3>
              <Badge variant="neutral">{groupedLeads[group].length}</Badge>
            </div>
            <div className="space-y-4 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
              {groupedLeads[group].length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-500">
                  No leads yet
                </div>
              ) : (
                groupedLeads[group].map((lead) => (
                  <LeadCard
                    key={lead.id}
                    activeLog={getActiveStageLog(lead, snapshot.stageLogs)}
                    href={`${basePath}?lead=${lead.id}`}
                    lead={lead}
                    parallelTracks={getLeadParallelTracks(snapshot, lead)}
                    showClientName={showClientName}
                  />
                ))
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
