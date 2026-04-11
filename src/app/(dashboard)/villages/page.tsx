"use client";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Eye, Pencil, MapPin } from "lucide-react";
import { mockVillages } from "@/lib/mock-data";
import { formatCurrency } from "@/utils/format-currency";
import { usePermission } from "@/hooks/use-permission";
import { useRouter } from "next/navigation";
import type { VillageManagement } from "@/types";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  pending: "outline",
  suspended: "destructive",
  inactive: "secondary",
};

const statusLabel: Record<string, string> = {
  active: "Aktif",
  pending: "Pending",
  suspended: "Suspended",
  inactive: "Nonaktif",
};

export default function VillagesPage() {
  const router = useRouter();
  const canCreate = usePermission("villages", "create");

  const columns: Column<VillageManagement>[] = [
    {
      key: "name",
      header: "Desa Wisata",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
            <MapPin className="text-primary h-4 w-4" />
          </div>
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-muted-foreground text-xs">{row.regency}, {row.province}</p>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => <Badge variant={statusVariant[row.status]}>{statusLabel[row.status]}</Badge>,
    },
    {
      key: "partners",
      header: "Partner",
      cell: (row) => <span className="text-sm">{row.stats.totalPartners}</span>,
    },
    {
      key: "rating",
      header: "Rating",
      cell: (row) => (
        <span className="text-sm">{row.stats.averageRating > 0 ? `⭐ ${row.stats.averageRating}` : "—"}</span>
      ),
    },
    {
      key: "revenue",
      header: "Pendapatan/Bulan",
      cell: (row) => (
        <span className="text-sm font-medium">{formatCurrency(row.stats.monthlyRevenue)}</span>
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
            <DropdownMenuItem onClick={() => router.push(`/villages/${row.id}`)}>
              <Eye className="mr-2 h-4 w-4" /> Lihat Detail
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/villages/${row.id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Villages" description="Kelola desa wisata terdaftar">
        {canCreate && (
          <Button onClick={() => router.push("/villages/create")}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Desa
          </Button>
        )}
      </PageHeader>

      <DataTable
        data={mockVillages}
        columns={columns}
        searchPlaceholder="Cari nama desa..."
        searchFn={(item, q) =>
          item.name.toLowerCase().includes(q) || item.province.toLowerCase().includes(q)
        }
      />
    </div>
  );
}
