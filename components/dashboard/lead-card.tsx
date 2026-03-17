import Link from "next/link";

import { ParallelTrackItem } from "@/lib/dashboard";
import { Badge } from "@/components/ui/badge";
import { SLABadge } from "@/components/ui/sla-badge";
import { STAGE_MAP } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Lead, StageLog } from "@/types/app";

interface LeadCardProps {
  lead: Lead;
  activeLog?: StageLog;
  href: string;
  showClientName: boolean;
  parallelTracks: ParallelTrackItem[];
}

export function LeadCard({
  lead,
  activeLog,
  href,
  showClientName,
  parallelTracks
}: LeadCardProps) {
  const stage = STAGE_MAP[lead.currentStage];
  const isBreached = activeLog?.slaStatus === "breached";

  return (
    <Link
      href={href}
      className={cn(
        "group block rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card",
        isBreached ? "border-red-300 bg-red-50/50" : "border-slate-200"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-slate-950 truncate">{lead.leadCode}</h3>
          <p className="mt-1 text-xs text-slate-500 truncate">
            {showClientName && lead.clientName ? lead.clientName : "Client confidential"}
          </p>
        </div>
        <SLABadge
          deadlineAt={activeLog?.deadlineAt}
          startedAt={activeLog?.startedAt}
        />
      </div>

      {lead.requirementDetails ? (
        <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-600">
          {lead.requirementDetails}
        </p>
      ) : null}

      <div className="mt-3 space-y-1.5">
        {parallelTracks.map((track) => (
          <div
            key={track.label}
            className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {track.label}
            </span>
            <Badge variant={track.tone}>{track.value}</Badge>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <Badge variant="blue">{stage.name}</Badge>
        <span className="text-xs font-medium text-slate-400 group-hover:text-primary transition">
          View &rarr;
        </span>
      </div>
    </Link>
  );
}
