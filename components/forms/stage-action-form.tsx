"use client";

import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { StageDefinition } from "@/types/app";

interface StageActionFormProps {
  stage: StageDefinition;
  canAct: boolean;
  isDemo: boolean;
  salesExecutives: Array<{ id: string; fullName: string }>;
}

const fieldBaseClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-200 focus:bg-white";

export function StageActionForm({
  stage,
  canAct,
  isDemo,
  salesExecutives
}: StageActionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const helperText = useMemo(() => {
    if (stage.systemDriven) {
      return "This step is system-driven in Phase 1 and does not require a manual action.";
    }

    if (isDemo) {
      return "Demo mode is active. Submitted values are validated in the UI and can be wired to Supabase mutations next.";
    }

    return "This action form is scaffolded for the final Supabase-backed workflow mutations.";
  }, [isDemo, stage.systemDriven]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canAct || stage.systemDriven) {
      toast.error("This stage is read-only for your role.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    setIsSubmitting(true);

    try {
      switch (stage.key) {
        case "1": {
          if (
            !formData.get("formulationBriefUrl") ||
            !formData.get("packagingBriefUrl") ||
            !formData.get("formulationDeadline") ||
            !formData.get("packagingDeadline")
          ) {
            throw new Error("Both briefs and both requested deadlines are required.");
          }
          break;
        }
        case "2A":
        case "2B": {
          const decision = formData.get("decision");
          if (!decision) {
            throw new Error("Select approval or rejection.");
          }

          if (decision === "approved" && !formData.get("committedTimeline")) {
            throw new Error("Provide the committed timeline when approving a brief.");
          }

          if (decision === "rejected" && !formData.get("notes")) {
            throw new Error("Add a rejection reason before submitting.");
          }
          break;
        }
        case "3":
        case "6_ACK":
        case "7.1":
        case "7.3": {
          if (!formData.get("confirmed")) {
            throw new Error("Confirm the required checkbox before continuing.");
          }
          break;
        }
        case "4A":
        case "4B": {
          if (!formData.get("prepStatus")) {
            throw new Error("Select the current preparation status.");
          }
          break;
        }
        case "5A":
        case "5B": {
          if (!formData.get("confirmed")) {
            throw new Error("Mark the sample as dispatched to Sales Manager.");
          }
          break;
        }
        case "6": {
          if (!formData.get("salesExecutiveId")) {
            throw new Error("Assign a sales executive for the dispatch task.");
          }
          break;
        }
        case "7.2": {
          if (!formData.get("courierDocket")) {
            throw new Error("Courier docket number is required.");
          }
          break;
        }
        case "9": {
          if (!formData.get("clientResponse")) {
            throw new Error("Select the client response outcome.");
          }
          break;
        }
        default:
          break;
      }

      toast.success(
        isDemo
          ? `${stage.actionLabel} captured in demo mode.`
          : `${stage.actionLabel} validated. Connect the final mutation handler in Supabase.`
      );
      event.currentTarget.reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to submit this stage action."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (stage.systemDriven) {
    return (
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        {helperText}
      </div>
    );
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <p className="rounded-xl bg-slate-50 px-3 py-2.5 text-sm leading-5 text-slate-600">
        {helperText}
      </p>

      {stage.key === "0" ? (
        <label className="block text-sm font-medium text-slate-700">
          Intake note
          <textarea
            className={fieldBaseClass}
            name="notes"
            placeholder="Summarize the enquiry, reference items, and sample ask."
            rows={4}
          />
        </label>
      ) : null}

      {stage.key === "1" ? (
        <>
          <label className="block text-sm font-medium text-slate-700">
            Formulation brief URL
            <input
              className={fieldBaseClass}
              name="formulationBriefUrl"
              placeholder="Paste the formulation brief URL"
              type="url"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Formulation requested deadline
            <input
              className={fieldBaseClass}
              name="formulationDeadline"
              type="datetime-local"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Packaging brief URL
            <input
              className={fieldBaseClass}
              name="packagingBriefUrl"
              placeholder="Paste the packaging brief URL"
              type="url"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Packaging requested deadline
            <input
              className={fieldBaseClass}
              name="packagingDeadline"
              type="datetime-local"
            />
          </label>
        </>
      ) : null}

      {["2A", "2B"].includes(stage.key) ? (
        <>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-medium text-slate-700">Decision</p>
            <div className="mt-2 flex gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input name="decision" type="radio" value="approved" />
                Approve
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input name="decision" type="radio" value="rejected" />
                Reject
              </label>
            </div>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            Committed timeline
            <input
              className={fieldBaseClass}
              name="committedTimeline"
              type="datetime-local"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Review comment
            <textarea
              className={fieldBaseClass}
              name="notes"
              placeholder="Add feasibility note or rejection comment."
              rows={4}
            />
          </label>
        </>
      ) : null}

      {stage.key === "3" ? (
        <label className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
          <input className="mt-0.5 h-4 w-4 rounded border-slate-300" name="confirmed" type="checkbox" />
          <span>Timeline sent to client via WhatsApp and Email.</span>
        </label>
      ) : null}

      {["4A", "4B"].includes(stage.key) ? (
        <label className="block text-sm font-medium text-slate-700">
          Preparation status
          <select className={fieldBaseClass} defaultValue="" name="prepStatus">
            <option disabled value="">
              Select status
            </option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Ready">Ready</option>
          </select>
        </label>
      ) : null}

      {["5A", "5B"].includes(stage.key) ? (
        <>
          <label className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
            <input className="mt-0.5 h-4 w-4 rounded border-slate-300" name="confirmed" type="checkbox" />
            <span>Sample dispatched to Sales Manager.</span>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Dispatch note / photo URL
            <input
              className={fieldBaseClass}
              name="documentUrl"
              placeholder="Paste an optional dispatch-note URL"
              type="url"
            />
          </label>
        </>
      ) : null}

      {["5A_CONFIRM", "5B_CONFIRM", "6_ACK", "7.1", "7.3"].includes(stage.key) ? (
        <label className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
          <input className="mt-0.5 h-4 w-4 rounded border-slate-300" name="confirmed" type="checkbox" />
          <span>Confirm completion for this step.</span>
        </label>
      ) : null}

      {stage.key === "6" ? (
        <label className="block text-sm font-medium text-slate-700">
          Assign sales executive
          <select className={fieldBaseClass} defaultValue="" name="salesExecutiveId">
            <option disabled value="">
              Select executive
            </option>
            {salesExecutives.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullName}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {stage.key === "7.2" ? (
        <label className="block text-sm font-medium text-slate-700">
          Courier docket number
          <input
            className={fieldBaseClass}
            name="courierDocket"
            placeholder="Enter the docket number"
            type="text"
          />
        </label>
      ) : null}

      {stage.key === "9" ? (
        <>
          <label className="block text-sm font-medium text-slate-700">
            Expected delivery date
            <input
              className={fieldBaseClass}
              name="expectedDeliveryDate"
              type="datetime-local"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Client response
            <select className={fieldBaseClass} defaultValue="" name="clientResponse">
              <option disabled value="">
                Select response
              </option>
              <option value="approved">Approved</option>
              <option value="feedback_revision">Feedback / Revision</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Notes
            <textarea
              className={fieldBaseClass}
              name="notes"
              placeholder="Add client feedback, revision notes, or rejection reason."
              rows={4}
            />
          </label>
        </>
      ) : null}

      <Button className="w-full" disabled={isSubmitting || !canAct} type="submit">
        {isSubmitting ? "Submitting..." : stage.actionLabel}
      </Button>
      {!canAct ? (
        <p className="text-sm text-slate-500">
          This stage is read-only for your role.
        </p>
      ) : null}
    </form>
  );
}
