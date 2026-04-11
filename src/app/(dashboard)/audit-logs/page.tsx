"use client";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { mockAuditLogs } from "@/lib/mock-data";
import { formatDateTime } from "@/utils/format-date";
import type { AuditLog } from "@/types";

const actionVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  login: "outline",
  logout: "outline",
  create: "default",
  update: "secondary",
  delete: "destructive",
  approve: "default",
  reject: "destructive",
  export: "secondary",
  bulk_action: "secondary",
  settings_change: "secondary",
  password_reset: "outline",
  role_change: "secondary",
};

export default function AuditLogsPage() {
  const columns: Column<AuditLog>[] = [
    {
      key: "timestamp",
      header: "Waktu",
      cell: (row) => <span className="text-muted-foreground text-xs">{formatDateTime(row.timestamp)}</span>,
    },
    {
      key: "user",
      header: "User",
      cell: (row) => (
        <div>
          <p className="text-sm font-medium">{row.userName}</p>
          <p className="text-muted-foreground text-xs">{row.userRole}</p>
        </div>
      ),
    },
    {
      key: "action",
      header: "Aksi",
      cell: (row) => (
        <Badge variant={actionVariant[row.action] || "outline"} className="capitalize">
          {row.action.replace("_", " ")}
        </Badge>
      ),
    },
    {
      key: "module",
      header: "Modul",
      cell: (row) => <span className="text-sm capitalize">{row.module.replace("_", " ")}</span>,
    },
    {
      key: "description",
      header: "Deskripsi",
      cell: (row) => <span className="max-w-xs truncate text-sm">{row.description}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <Badge variant={row.status === "success" ? "default" : "destructive"}>
          {row.status === "success" ? "Berhasil" : "Gagal"}
        </Badge>
      ),
    },
    {
      key: "ip",
      header: "IP",
      cell: (row) => <span className="text-muted-foreground font-mono text-xs">{row.ipAddress}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Logs" description="Monitor aktivitas pengguna" />

      <DataTable
        data={mockAuditLogs}
        columns={columns}
        searchPlaceholder="Cari user atau deskripsi..."
        searchFn={(item, q) =>
          item.userName.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.action.toLowerCase().includes(q)
        }
      />
    </div>
  );
}
