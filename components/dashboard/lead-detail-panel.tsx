import Link from "next/link";
import {
  FileText,
  Mail,
  Phone,
  StickyNote,
  X
} from "lucide-react";

import { StageActionForm } from "@/components/forms/stage-action-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SLABadge } from "@/components/ui/sla-badge";
import {
  getLeadCombinedTimeline,
  getLeadParallelTracks
} from "@/lib/dashboard";
import { ROLE_LABELS, STAGE_MAP } from "@/lib/constants";
import {
  canViewClientInfo,
  formatDateTime,
  getActiveStageLog,
  getStaticTrackingUrl,
  isReadOnlyRole
} from "@/lib/utils";
import { AppRole, AppUser, LeadBundle } from "@/types/app";

interface LeadDetailPanelProps {
  bundle: LeadBundle;
  role: AppRole | null;
  users: AppUser[];
  basePath: string;
  isDemo: boolean;
}

export function LeadDetailPanel({
  bundle,
  role,
  users,
  basePath,
  isDemo
}: LeadDetailPanelProps) {
  const { lead, briefs, notifications, samples, stageLogs } = bundle;
  const stage = STAGE_MAP[lead.currentStage];
  const activeLog = getActiveStageLog(lead, stageLogs);
  const showClientInfo = canViewClientInfo(role);
  const readOnlyRole = isReadOnlyRole(role);
  const canAct = !readOnlyRole && role === stage.ownerRole;
  const salesExecutives = users
    .filter((user) => user.role === "sales_executive")
    .map((user) => ({ id: user.id, fullName: user.fullName }));
  const parallelTracks = getLeadParallelTracks(
    {
      currentUser: null,
      role,
      isDemo,
      leads: [lead],
      stageLogs,
      briefs,
      samples,
      notifications,
      users
    },
    lead
  );

  const documents = [
    ...lead.referenceUrls.map((url, index) => ({
      id: `reference-${index}`,
      label: `Client reference ${index + 1}`,
      url,
      meta: "reference"
    })),
    ...briefs.map((brief) => ({
      id: brief.id,
      label: `${brief.briefType} brief`,
      url: brief.documentUrl,
      meta: brief.approvalStatus
    })),
    ...samples
      .filter((sample) => sample.dispatchNoteUrl)
      .map((sample) => ({
        id: sample.id,
        label: `${sample.sampleType} dispatch note`,
        url: sample.dispatchNoteUrl ?? "#",
        meta: "dispatch note"
      })),
    ...samples
      .filter((sample) => sample.courierDocket)
      .map((sample) => ({
        id: `${sample.id}-tracking`,
        label: `${sample.sampleType} tracking reference`,
        url: sample.trackingUrl ?? getStaticTrackingUrl(sample.courierDocket) ?? "#",
        meta: sample.courierDocket ?? "tracking"
      }))
  ];

  return (
    <>
      <Link
        className="fixed inset-0 z-30 bg-slate-950/20 backdrop-blur-sm"
        href={basePath}
      />
      <aside className="fixed inset-y-0 right-0 z-40 w-full max-w-2xl overflow-y-auto border-l border-slate-200 bg-slate-50 shadow-panel">
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
                {lead.leadCode}
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-950 truncate">
                {showClientInfo && lead.clientName ? lead.clientName : "Confidential"}
              </h2>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="blue">{stage.name}</Badge>
                <Badge variant="neutral">{ROLE_LABELS[stage.ownerRole]}</Badge>
                <SLABadge
                  deadlineAt={activeLog?.deadlineAt}
                  startedAt={activeLog?.startedAt}
                />
              </div>
            </div>
            <Link
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 flex-shrink-0"
              href={basePath}
            >
              <X className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="space-y-5 px-5 py-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-bold text-slate-950">Lead Overview</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{lead.requirementDetails}</p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
                  Workflow Status
                </p>
                <p className="mt-1.5 text-sm font-semibold text-slate-900">
                  {lead.status.replaceAll("_", " ")}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
                  Expected Delivery
                </p>
                <p className="mt-1.5 text-sm font-semibold text-slate-900">
                  {lead.expectedDeliveryDate
                    ? formatDateTime(lead.expectedDeliveryDate)
                    : "Awaiting entry"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-950">
                  Parallel Workflow Status
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Both operational tracks displayed side by side.
                </p>
              </div>
              <Badge variant="neutral">{stage.group}</Badge>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {parallelTracks.map((track) => (
                <div
                  key={track.label}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-3"
                >
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
                    {track.label}
                  </p>
                  <div className="mt-2">
                    <Badge variant={track.tone}>{track.value}</Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">
              <p className="text-xs font-bold text-slate-900">Combined timeline</p>
              <p className="mt-1 text-sm">{getLeadCombinedTimeline(briefs)}</p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-950">Current Stage</h3>
                <p className="mt-0.5 text-xs text-slate-500 truncate">
                  {stage.name} · {ROLE_LABELS[stage.ownerRole]}
                </p>
              </div>
              <Badge variant={canAct ? "green" : "neutral"}>
                {canAct ? "Action" : "Read only"}
              </Badge>
            </div>

            <div className="mt-4">
              <StageActionForm
                canAct={canAct}
                isDemo={isDemo}
                salesExecutives={salesExecutives}
                stage={stage}
              />
            </div>

            {lead.status === "client_approved_ready_for_pi" ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900">
                      Move to Bulk Order Process
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Disabled in Phase 1.
                    </p>
                  </div>
                  <Button disabled variant="secondary" size="sm">
                    Coming Soon
                  </Button>
                </div>
              </div>
            ) : null}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-bold text-slate-950">Attached Documents</h3>
            <div className="mt-3 space-y-2">
              {documents.length === 0 ? (
                <p className="rounded-xl bg-slate-50 px-3 py-3 text-sm text-slate-500">
                  No documents uploaded yet.
                </p>
              ) : (
                documents.map((document) => (
                  <a
                    key={document.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-3 py-3 transition hover:bg-slate-50"
                    href={document.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {document.label}
                        </p>
                        <p className="text-[10px] uppercase tracking-widest text-slate-400">
                          {document.meta}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-blue-600 flex-shrink-0">Open &rarr;</span>
                  </a>
                ))
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-bold text-slate-950">Stage History</h3>
            <div className="mt-3 space-y-2">
              {stageLogs.map((stageLog) => (
                <div key={stageLog.id} className="flex gap-3">
                  <div className="flex w-3 justify-center pt-1.5">
                    <span
                      className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${
                        stageLog.completedAt ? "bg-emerald-500" : "bg-amber-400"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0 rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{stageLog.stageName}</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {ROLE_LABELS[stageLog.assignedToRole]}
                        </p>
                      </div>
                      <Badge variant={stageLog.completedAt ? "green" : "yellow"}>
                        {stageLog.completedAt ? "Done" : "Active"}
                      </Badge>
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <div className="rounded-lg bg-white p-2.5 text-xs">
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
                          Started
                        </p>
                        <p className="mt-1 font-semibold text-slate-900">
                          {formatDateTime(stageLog.startedAt)}
                        </p>
                      </div>
                      <div className="rounded-lg bg-white p-2.5 text-xs">
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
                          Deadline
                        </p>
                        <p className="mt-1 font-semibold text-slate-900">
                          {formatDateTime(stageLog.deadlineAt)}
                        </p>
                      </div>
                    </div>
                    {stageLog.notes ? (
                      <div className="mt-2 flex gap-2 rounded-lg bg-white p-2.5 text-xs leading-5 text-slate-600">
                        <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                        <p>{stageLog.notes}</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-bold text-slate-950">Client Info</h3>
              {showClientInfo ? (
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{lead.clientEmail ?? "Not shared"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{lead.clientPhone ?? "Not shared"}</span>
                  </div>
                </div>
              ) : (
                <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-500">
                  Confidential
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-bold text-slate-950">Notifications</h3>
              <div className="mt-3 space-y-2">
                {notifications.length === 0 ? (
                  <p className="rounded-xl bg-slate-50 px-3 py-3 text-sm text-slate-500">
                    No notifications for this lead.
                  </p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="rounded-xl bg-slate-50 px-3 py-3 text-sm leading-5 text-slate-600"
                    >
                      <p className="font-medium text-slate-900">{notification.message}</p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-widest text-slate-400">
                        {formatDateTime(notification.createdAt)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}
