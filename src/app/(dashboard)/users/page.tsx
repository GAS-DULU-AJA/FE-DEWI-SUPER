"use client";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { mockUsers } from "@/lib/mock-data";
import { formatDateTime } from "@/utils/format-date";
import { usePermission } from "@/hooks/use-permission";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { toast } from "sonner";
import type { AdminUser, UserStatus, AdminRole } from "@/types";

const statusVariant: Record<UserStatus, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  inactive: "secondary",
  suspended: "destructive",
  pending_verification: "outline",
};

const statusLabel: Record<UserStatus, string> = {
  active: "Aktif",
  inactive: "Nonaktif",
  suspended: "Suspended",
  pending_verification: "Menunggu Verifikasi",
};

const roleLabel: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  finance_admin: "Finance",
  support: "Support",
  viewer: "Viewer",
};

export default function UsersPage() {
  const router = useRouter();
  const canCreate = usePermission("users", "create");
  const canDelete = usePermission("users", "delete");
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  const columns: Column<AdminUser>[] = [
    {
      key: "name",
      header: "Pengguna",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {row.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-muted-foreground text-xs">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (row) => (
        <div>
          <p className="text-sm">{roleLabel[row.role]}</p>
          {row.partnerRole && (
            <p className="text-muted-foreground text-xs">{row.partnerRole}</p>
          )}
        </div>
      ),
    },
    {
      key: "village",
      header: "Desa",
      cell: (row) => <span className="text-sm">{row.villageName || "—"}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <Badge variant={statusVariant[row.status]}>{statusLabel[row.status]}</Badge>
      ),
    },
    {
      key: "lastLogin",
      header: "Login Terakhir",
      cell: (row) => (
        <span className="text-muted-foreground text-sm">
          {row.lastLoginAt ? formatDateTime(row.lastLoginAt) : "Belum login"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/users/${row.id}`)}>
              <Eye className="mr-2 h-4 w-4" /> Lihat Detail
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/users/${row.id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            {canDelete && (
              <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget(row)}>
                <Trash2 className="mr-2 h-4 w-4" /> Hapus
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Users" description="Kelola data pengguna platform">
        {canCreate && (
          <Button onClick={() => router.push("/users/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah User
          </Button>
        )}
      </PageHeader>

      <DataTable
        data={mockUsers}
        columns={columns}
        searchPlaceholder="Cari nama atau email..."
        searchFn={(item, q) =>
          item.name.toLowerCase().includes(q) || item.email.toLowerCase().includes(q)
        }
      />

      <ConfirmationDialog
        open={!!deleteTarget}
        title="Hapus User"
        description={`Apakah Anda yakin ingin menghapus user "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        variant="destructive"
        onConfirm={() => {
          toast.success(`User "${deleteTarget?.name}" berhasil dihapus`);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
