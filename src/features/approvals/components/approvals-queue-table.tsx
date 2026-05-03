"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { PartnershipQueueItem } from "../types";

const PRIORITY_STYLES = {
  urgent: "bg-red-50 text-red-600 border border-red-200",
  high: "bg-amber-50 text-amber-600 border border-amber-200",
  normal: "bg-slate-50 text-slate-500 border border-slate-200",
};

const PRIORITY_LABELS = { urgent: "Urgent", high: "High", normal: "Normal" };

const DOC_STYLES = {
  all_uploaded: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  pending: "bg-amber-50 text-amber-600 border border-amber-200",
  missing: "bg-red-50 text-red-600 border border-red-200",
};

interface ApprovalsQueueTableProps {
  items: PartnershipQueueItem[];
  totalCount: number;
  isLoading?: boolean;
}

const PAGE_SIZE = 4;

export function ApprovalsQueueTable({
  items,
  totalCount,
  isLoading,
}: ApprovalsQueueTableProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const pageCount = Math.ceil(items.length / PAGE_SIZE);
  const paginated = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      {/* Table header */}
      <div className="grid grid-cols-[2fr_1.2fr_1fr_1.2fr_0.8fr_auto] gap-3 border-b border-border px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <span>Property Name</span>
        <span>Location</span>
        <span>Submission Date</span>
        <span>Documents Status</span>
        <span>Priority</span>
        <span>Action</span>
      </div>

      {/* Rows */}
      {paginated.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          No results found
        </div>
      ) : (
        paginated.map((item, idx) => (
          <div
            key={item.id}
            className={cn(
              "grid grid-cols-[2fr_1.2fr_1fr_1.2fr_0.8fr_auto] items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/30",
              idx < paginated.length - 1 && "border-b border-border",
            )}
          >
            {/* Property Name */}
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative h-10 w-14 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                <Image
                  src={item.thumbnailUrl}
                  alt={item.propertyName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{item.propertyName}</p>
                <p className="text-xs text-muted-foreground">Request ID: {item.requestNo}</p>
              </div>
            </div>

            {/* Location */}
            <span className="text-sm text-foreground">{item.location}</span>

            {/* Submission Date */}
            <span className="text-sm text-foreground">
              {new Date(item.submissionDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>

            {/* Document Status */}
            <span
              className={cn(
                "inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
                DOC_STYLES[item.documentStatus],
              )}
            >
              {item.documentStatus === "all_uploaded" && "All Uploaded"}
              {item.documentStatus === "pending" && `Pending (${item.pendingDocCount ?? 1})`}
              {item.documentStatus === "missing" && "Missing"}
            </span>

            {/* Priority */}
            <span
              className={cn(
                "inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                PRIORITY_STYLES[item.priority],
              )}
            >
              {PRIORITY_LABELS[item.priority]}
            </span>

            {/* Action */}
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
              onClick={() => router.push(`/approvals/${item.id}`)}
            >
              Review
            </Button>
          </div>
        ))
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-border px-5 py-3 text-sm text-muted-foreground">
        <span>
          Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, items.length)} of{" "}
          {totalCount} requests
        </span>
        <div className="flex items-center gap-1">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded p-1 hover:bg-muted disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: Math.min(pageCount, 3) }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={cn(
                "h-7 w-7 rounded text-xs font-medium",
                page === n ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              {n}
            </button>
          ))}
          <button
            disabled={page >= pageCount}
            onClick={() => setPage((p) => p + 1)}
            className="rounded p-1 hover:bg-muted disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
