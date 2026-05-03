import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VerificationStep } from "../types";

interface VerificationFlowProps {
  steps: VerificationStep[];
}

const stepStyles = {
  completed: {
    circle: "bg-primary border-primary text-primary-foreground",
    line: "bg-primary",
    label: "font-semibold text-foreground",
    sub: "text-muted-foreground text-xs",
  },
  in_progress: {
    circle: "bg-amber-50 border-amber-400 text-amber-600",
    line: "bg-border",
    label: "font-semibold text-foreground",
    sub: "text-amber-500 text-xs font-medium",
  },
  awaiting: {
    circle: "bg-muted border-border text-muted-foreground",
    line: "bg-border",
    label: "text-muted-foreground",
    sub: "text-muted-foreground text-xs",
  },
};

const subLabel: Record<string, string> = {
  completed: "✓ Verified",
  in_progress: "In progress...",
  awaiting: "Awaiting review",
};

export function VerificationFlow({ steps }: VerificationFlowProps) {
  return (
    <div className="space-y-0">
      {steps.map((step, idx) => {
        const s = stepStyles[step.status];
        return (
          <div key={step.id} className="flex gap-3">
            {/* Step column */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold",
                  s.circle,
                )}
              >
                {step.status === "completed" ? (
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                ) : (
                  step.id
                )}
              </div>
              {idx < steps.length - 1 && (
                <div className={cn("w-0.5 flex-1 my-1", s.line)} style={{ minHeight: 20 }} />
              )}
            </div>

            {/* Label column */}
            <div className="pb-4">
              <p className={cn("text-sm", s.label)}>{step.label}</p>
              <p className={cn(s.sub)}>
                {step.status === "completed" && step.completedAt
                  ? step.completedAt
                  : subLabel[step.status]}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
