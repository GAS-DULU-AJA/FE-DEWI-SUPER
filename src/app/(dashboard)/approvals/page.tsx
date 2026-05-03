"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ApprovalStatsCard } from "@/features/approvals/components/approval-stats-card";
import { QueueFilterBar } from "@/features/approvals/components/queue-filter-bar";
import { ApprovalsQueueTable } from "@/features/approvals/components/approvals-queue-table";
import { useApprovalsQueue } from "@/features/approvals/hooks/use-approvals-queue";

export default function ApprovalsPage() {
  const { stats, items, totalCount, isLoading, filter, setFilter, search, setSearch } =
    useApprovalsQueue();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Partnership Approvals Queue
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Verify and manage new luxury hospitality partnership requests.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ApprovalStatsCard
          label="Pending Verifications"
          value={stats?.pendingVerifications ?? "—"}
          delta={stats?.pendingDelta}
          deltaType="negative"
        />
        <ApprovalStatsCard
          label="Average Review Time"
          value={stats ? `${stats.averageReviewDays} days` : "—"}
          deltaType="neutral"
        />
        <ApprovalStatsCard
          label="Approvals This Week"
          value={stats?.approvalsThisWeek ?? "—"}
          delta={stats?.weeklyDelta}
          deltaType="positive"
        />
      </div>

      {/* Filter bar + search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <QueueFilterBar active={filter} onChange={setFilter} />
        <div className="relative ml-auto w-full sm:w-56">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search requests..."
            className="pl-9 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <ApprovalsQueueTable
        items={items}
        totalCount={totalCount}
        isLoading={isLoading}
      />
    </div>
  );
}
