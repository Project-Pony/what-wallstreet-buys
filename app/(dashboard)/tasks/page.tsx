import { LeadDetailPanel } from "@/components/dashboard/lead-detail-panel";
import { TaskList } from "@/components/dashboard/task-list";
import { Badge } from "@/components/ui/badge";
import { getRoleHomePath } from "@/lib/auth";
import { deriveTasks } from "@/lib/utils";
import { getDashboardSnapshot } from "@/lib/data/dashboard";
import { getLeadBundle } from "@/lib/dashboard";
import { redirect } from "next/navigation";

interface TasksPageProps {
  searchParams?: {
    lead?: string;
  };
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const snapshot = await getDashboardSnapshot();

  if (!snapshot.role || !snapshot.currentUser) {
    redirect("/login");
  }

  if (snapshot.role === "business_owner") {
    redirect(getRoleHomePath(snapshot.role));
  }

  const tasks = deriveTasks(snapshot, snapshot.role, snapshot.currentUser.id);
  const selectedBundle = searchParams?.lead
    ? getLeadBundle(snapshot, searchParams.lead)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-blue-600 font-medium">
            Role Queue
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950">My Tasks</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Tasks sorted by urgency, limited to your assigned work.
          </p>
        </div>
        <Badge variant="blue">{tasks.length} active</Badge>
      </div>

      <TaskList basePath="/tasks" tasks={tasks} />

      {selectedBundle ? (
        <LeadDetailPanel
          basePath="/tasks"
          bundle={selectedBundle}
          isDemo={snapshot.isDemo}
          role={snapshot.role}
          users={snapshot.users.length > 0 ? snapshot.users : snapshot.currentUser ? [snapshot.currentUser] : []}
        />
      ) : null}
    </div>
  );
}
