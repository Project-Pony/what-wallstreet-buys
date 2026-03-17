import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SLABadge } from "@/components/ui/sla-badge";
import { STAGE_MAP } from "@/lib/constants";
import { cn, formatDateTime } from "@/lib/utils";
import { TaskItem } from "@/types/app";

interface TaskListProps {
  tasks: TaskItem[];
  basePath: string;
}

export function TaskList({ tasks, basePath }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        description="No tasks are currently assigned to you. New workflow assignments will appear here automatically."
        title="No active tasks"
      />
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const stage = STAGE_MAP[task.stageKey];

        return (
          <div
            key={`${task.leadId}-${task.stageKey}`}
            className={cn(
              "rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-card",
              task.slaStatus === "breached" ? "border-red-200 bg-red-50/30" : "border-slate-200"
            )}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold text-slate-950">{task.leadCode}</p>
                  <Badge variant={task.slaStatus === "breached" ? "red" : "blue"}>
                    {stage.group}
                  </Badge>
                </div>
                <p className="mt-1.5 text-sm text-slate-600 truncate">{task.stageName}</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  Deadline: {formatDateTime(task.deadlineAt)}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <SLABadge deadlineAt={task.deadlineAt} />
                <Link href={`${basePath}?lead=${task.leadId}`}>
                  <Button size="sm">{task.actionLabel}</Button>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
