import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QueueFilter } from "../types";

interface QueueFilterBarProps {
  active: QueueFilter;
  onChange: (f: QueueFilter) => void;
}

const FILTERS: { value: QueueFilter; label: string }[] = [
  { value: "all", label: "All Requests" },
  { value: "high_priority", label: "High Priority" },
  { value: "pending_docs", label: "Pending Docs" },
];

export function QueueFilterBar({ active, onChange }: QueueFilterBarProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground mr-1 text-sm font-medium">Queue Filter:</span>
      <div className="flex items-center gap-1">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              active === f.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
      <Button variant="ghost" size="sm" className="ml-auto gap-1.5 text-primary text-xs">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Advanced Filters
      </Button>
    </div>
  );
}
