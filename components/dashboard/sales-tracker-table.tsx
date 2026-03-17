"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate, formatDateTime } from "@/lib/utils";

interface TrackerRow {
  lead: {
    id: string;
    leadCode: string;
    clientName: string | null;
    createdAt: string;
  };
  currentStageName: string;
  dispatchDate: string | null;
  docketNumber: string | null;
  expectedDeliveryDate: string | null;
  statusLabel: string;
  slaStatus: "on_time" | "at_risk" | "breached";
}

interface SalesTrackerTableProps {
  rows: TrackerRow[];
}

export function SalesTrackerTable({ rows }: SalesTrackerTableProps) {
  const [stageFilter, setStageFilter] = useState("all");
  const [slaFilter, setSlaFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const stageOptions = useMemo(
    () => Array.from(new Set(rows.map((row) => row.currentStageName))),
    [rows]
  );

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      if (stageFilter !== "all" && row.currentStageName !== stageFilter) {
        return false;
      }

      if (slaFilter !== "all" && row.slaStatus !== slaFilter) {
        return false;
      }

      if (fromDate && new Date(row.lead.createdAt) < new Date(fromDate)) {
        return false;
      }

      if (toDate && new Date(row.lead.createdAt) > new Date(`${toDate}T23:59:59`)) {
        return false;
      }

      return true;
    });
  }, [fromDate, rows, slaFilter, stageFilter, toDate]);

  if (rows.length === 0) {
    return (
      <EmptyState
        description="Active sales leads will appear here once the tracker is populated."
        title="No tracker rows available"
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 xl:grid-cols-4">
        <label className="text-sm font-medium text-slate-700">
          Stage
          <select
            className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-blue-200 focus:bg-white transition"
            value={stageFilter}
            onChange={(event) => setStageFilter(event.target.value)}
          >
            <option value="all">All stages</option>
            {stageOptions.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-slate-700">
          SLA status
          <select
            className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-blue-200 focus:bg-white transition"
            value={slaFilter}
            onChange={(event) => setSlaFilter(event.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="on_time">On time</option>
            <option value="at_risk">At risk</option>
            <option value="breached">Breached</option>
          </select>
        </label>

        <label className="text-sm font-medium text-slate-700">
          From date
          <input
            className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-blue-200 focus:bg-white transition"
            type="date"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          To date
          <input
            className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-blue-200 focus:bg-white transition"
            type="date"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
          />
        </label>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="hidden xl:grid grid-cols-[1.2fr_1fr_0.9fr_0.9fr_0.9fr_0.8fr] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          <span>Lead</span>
          <span>Stage</span>
          <span>Dispatch Date</span>
          <span>Docket No.</span>
          <span>Expected Delivery</span>
          <span>Status</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredRows.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-slate-500">
              No tracker rows match the selected filters.
            </div>
          ) : (
            filteredRows.map((row) => (
              <div
                key={row.lead.id}
                className="px-5 py-4 xl:grid xl:grid-cols-[1.2fr_1fr_0.9fr_0.9fr_0.9fr_0.8fr] xl:items-center gap-4 space-y-3 xl:space-y-0"
              >
                <div className="min-w-0">
                  <p className="font-bold text-sm text-slate-950 truncate">{row.lead.leadCode}</p>
                  <p className="mt-0.5 text-xs text-slate-500 truncate">
                    {row.lead.clientName ?? "Client hidden"}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Created {formatDateTime(row.lead.createdAt)}
                  </p>
                </div>
                <div>
                  <span className="xl:hidden text-[11px] font-bold uppercase tracking-wider text-slate-400">Stage: </span>
                  <span className="text-sm text-slate-700">{row.currentStageName}</span>
                </div>
                <div>
                  <span className="xl:hidden text-[11px] font-bold uppercase tracking-wider text-slate-400">Dispatch: </span>
                  <span className="text-sm text-slate-700">{formatDate(row.dispatchDate)}</span>
                </div>
                <div>
                  <span className="xl:hidden text-[11px] font-bold uppercase tracking-wider text-slate-400">Docket: </span>
                  <span className="text-sm text-slate-700">{row.docketNumber ?? "Pending"}</span>
                </div>
                <div>
                  <span className="xl:hidden text-[11px] font-bold uppercase tracking-wider text-slate-400">Delivery: </span>
                  <span className="text-sm text-slate-700">{formatDate(row.expectedDeliveryDate)}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="blue">{row.statusLabel}</Badge>
                  <Badge
                    variant={
                      row.slaStatus === "breached"
                        ? "red"
                        : row.slaStatus === "at_risk"
                          ? "yellow"
                          : "green"
                    }
                  >
                    {row.slaStatus.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
