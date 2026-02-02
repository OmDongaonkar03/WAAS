import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "running" | "completed" | "pending" | "failed";
  className?: string;
}

const statusConfig = {
  running: {
    bg: "bg-primary/10",
    text: "text-primary",
    dot: "bg-primary",
    label: "Running"
  },
  completed: {
    bg: "bg-success/10",
    text: "text-success",
    dot: "bg-success",
    label: "Completed"
  },
  pending: {
    bg: "bg-warning/10",
    text: "text-warning",
    dot: "bg-warning",
    label: "Pending"
  },
  failed: {
    bg: "bg-destructive/10",
    text: "text-destructive",
    dot: "bg-destructive",
    label: "Failed"
  }
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium",
      config.bg,
      config.text,
      className
    )}>
      <span className={cn(
        "w-1.5 h-1.5 rounded-full",
        config.dot,
        status === "running" && "animate-pulse"
      )} />
      {config.label}
    </div>
  );
}
