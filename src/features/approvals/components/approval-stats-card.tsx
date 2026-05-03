import { cn } from "@/lib/utils";

interface ApprovalStatsCardProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaType?: "positive" | "negative" | "neutral";
  className?: string;
}

export function ApprovalStatsCard({
  label,
  value,
  delta,
  deltaType = "neutral",
  className,
}: ApprovalStatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card px-5 py-4 shadow-sm",
        className,
      )}
    >
      <p className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wide">
        {label}
      </p>
      <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
      {delta && (
        <p
          className={cn("mt-1 text-xs font-medium", {
            "text-emerald-600": deltaType === "positive",
            "text-destructive": deltaType === "negative",
            "text-muted-foreground": deltaType === "neutral",
          })}
        >
          {delta}
        </p>
      )}
    </div>
  );
}
