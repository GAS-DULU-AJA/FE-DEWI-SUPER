"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatAdPlacement,
  formatAdRole,
  formatAdStatus,
  getHomepageAdRequests,
  summarizeAdRequests,
} from "@/features/advertisement";
import type { AdvertisementApprovalStatus, HomepageAdvertisementRequest } from "@/features/advertisement";

const statusVariant: Record<AdvertisementApprovalStatus, "default" | "secondary" | "destructive" | "outline"> = {
  draft: "outline",
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
};

export default function AdvertisementsPage() {
  const [requests, setRequests] = useState<HomepageAdvertisementRequest[]>(() => getHomepageAdRequests());

  const summary = useMemo(() => summarizeAdRequests(requests), [requests]);

  const updateStatus = (id: string, approved: boolean) => {
    setRequests((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: approved ? "approved" : "rejected",
              note: approved
                ? "Disetujui Super Admin untuk tampil di homepage"
                : "Ditolak Super Admin, mohon revisi materi",
            }
          : item,
      ),
    );
  };

  const columns: Column<HomepageAdvertisementRequest>[] = [
    {
      key: "campaign",
      header: "Campaign",
      cell: (row) => (
        <div>
          <p className="font-medium">{row.campaignName}</p>
          <p className="text-muted-foreground text-xs">{row.requestedBy}</p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (row) => <span className="text-sm">{formatAdRole(row.role)}</span>,
    },
    {
      key: "placement",
      header: "Placement",
      cell: (row) => <span className="text-sm">{formatAdPlacement(row.placement)}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => <Badge variant={statusVariant[row.status]}>{formatAdStatus(row.status)}</Badge>,
    },
    {
      key: "requestedAt",
      header: "Submitted",
      cell: (row) => <span className="text-muted-foreground text-sm">{row.requestedAt}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (row) =>
        row.status === "pending" ? (
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => updateStatus(row.id, true)}>
              Approve
            </Button>
            <Button size="sm" variant="outline" onClick={() => updateStatus(row.id, false)}>
              Reject
            </Button>
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">{row.note || "-"}</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Advertisement Management"
        description="Review, approve, and monitor homepage advertisement submissions from all partner roles."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Requests</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{summary.total}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-amber-600">{summary.pending}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Approved</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-emerald-600">{summary.approved}</CardContent>
        </Card>
      </div>

      <DataTable
        data={requests}
        columns={columns}
        searchPlaceholder="Cari campaign atau requester..."
        searchFn={(item, q) =>
          item.campaignName.toLowerCase().includes(q) ||
          item.requestedBy.toLowerCase().includes(q) ||
          formatAdRole(item.role).toLowerCase().includes(q)
        }
      />
    </div>
  );
}
