import React from "react";

export type BadgeVariant =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "processing"
  | "muted"
  | "gold"
  | "primary";

export interface BadgeProps {
  variant: BadgeVariant;
  label: string;
  dot?: boolean;
}

const variantStyles: Record<
  BadgeVariant,
  { bg: string; text: string; dot: string }
> = {
  success: {
    bg: "bg-[#DCFCE7]",
    text: "text-[#166534]",
    dot: "bg-green-500",
  },
  warning: {
    bg: "bg-[#FEF3C7]",
    text: "text-[#92400E]",
    dot: "bg-amber-500",
  },
  error: {
    bg: "bg-[#FEE2E2]",
    text: "text-[#991B1B]",
    dot: "bg-red-500",
  },
  info: {
    bg: "bg-[#DBEAFE]",
    text: "text-[#1E40AF]",
    dot: "bg-blue-500",
  },
  processing: {
    bg: "bg-[#EDE9FE]",
    text: "text-[#4338CA]",
    dot: "bg-purple-500",
  },
  muted: {
    bg: "bg-[#F5F0E8]",
    text: "text-[#7A6B5D]",
    dot: "bg-gray-400",
  },
  gold: {
    bg: "bg-[#FBF0C4]",
    text: "text-[#92400E]",
    dot: "bg-[#D9A900]",
  },
  primary: {
    bg: "bg-[#720000]",
    text: "text-white",
    dot: "bg-white",
  },
};

export function Badge({ variant, label, dot = true }: BadgeProps) {
  const styles = variantStyles[variant];
  return (
    <span
      className={`status-badge ${styles.bg} ${styles.text}`}
    >
      {dot && (
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${styles.dot}`}
        />
      )}
      {label}
    </span>
  );
}

// ─── Status label helpers ────────────────────────────────────────────────────

export function getOrderStatusBadge(status: string): {
  variant: BadgeVariant;
  label: string;
} {
  switch (status?.toLowerCase()) {
    case "pending":
      return { variant: "warning", label: "Pending" };
    case "confirmed":
      return { variant: "info", label: "Confirmed" };
    case "processing":
      return { variant: "processing", label: "Processing" };
    case "ready":
      return { variant: "gold", label: "Ready" };
    case "completed":
    case "delivered":
      return { variant: "success", label: "Completed" };
    case "cancelled":
    case "canceled":
      return { variant: "error", label: "Cancelled" };
    case "refunded":
      return { variant: "muted", label: "Refunded" };
    default:
      return { variant: "muted", label: status || "Unknown" };
  }
}

export function getBookingStatusBadge(status: string): {
  variant: BadgeVariant;
  label: string;
} {
  switch (status?.toLowerCase()) {
    case "upcoming":
    case "scheduled":
      return { variant: "info", label: "Scheduled" };
    case "confirmed":
      return { variant: "primary", label: "Confirmed" };
    case "in_progress":
    case "in progress":
    case "ongoing":
      return { variant: "processing", label: "In Progress" };
    case "completed":
    case "done":
      return { variant: "success", label: "Completed" };
    case "cancelled":
    case "canceled":
      return { variant: "error", label: "Cancelled" };
    case "no_show":
    case "no show":
      return { variant: "warning", label: "No Show" };
    case "rescheduled":
      return { variant: "gold", label: "Rescheduled" };
    default:
      return { variant: "muted", label: status || "Unknown" };
  }
}

export function getPaymentStatusBadge(status: string): {
  variant: BadgeVariant;
  label: string;
} {
  switch (status?.toLowerCase()) {
    case "paid":
    case "success":
    case "successful":
      return { variant: "success", label: "Paid" };
    case "pending":
      return { variant: "warning", label: "Pending" };
    case "partial":
    case "partially_paid":
      return { variant: "gold", label: "Partial" };
    case "overdue":
      return { variant: "error", label: "Overdue" };
    case "refunded":
      return { variant: "info", label: "Refunded" };
    case "failed":
      return { variant: "error", label: "Failed" };
    case "processing":
      return { variant: "processing", label: "Processing" };
    case "waived":
      return { variant: "muted", label: "Waived" };
    default:
      return { variant: "muted", label: status || "Unknown" };
  }
}

export function getDeliveryStatusBadge(status: string): {
  variant: BadgeVariant;
  label: string;
} {
  switch (status?.toLowerCase()) {
    case "pending":
      return { variant: "warning", label: "Pending" };
    case "packed":
    case "packing":
      return { variant: "gold", label: "Packing" };
    case "dispatched":
    case "shipped":
      return { variant: "info", label: "Dispatched" };
    case "out_for_delivery":
    case "out for delivery":
      return { variant: "processing", label: "Out for Delivery" };
    case "delivered":
    case "completed":
      return { variant: "success", label: "Delivered" };
    case "failed":
    case "undelivered":
      return { variant: "error", label: "Failed" };
    case "returned":
      return { variant: "muted", label: "Returned" };
    default:
      return { variant: "muted", label: status || "Unknown" };
  }
}

export default Badge;
