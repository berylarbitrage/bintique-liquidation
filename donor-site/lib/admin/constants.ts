export const STATUSES = [
  "new",
  "contacted",
  "full_app_pending",
  "full_app_submitted",
  "screening",
  "active",
  "matched",
  "completed",
  "rejected",
  "withdrawn",
] as const;
export type Status = (typeof STATUSES)[number];

export const STATUS_LABELS: Record<Status, string> = {
  new: "New",
  contacted: "Contacted",
  full_app_pending: "Full app pending",
  full_app_submitted: "Full app submitted",
  screening: "Screening",
  active: "Active",
  matched: "Matched",
  completed: "Completed",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export const PAGE_SIZE = 25;
