"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, CreditCard, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { mockTransactions } from "@/lib/mock-data";
import { formatCurrency } from "@/utils/format-currency";
import { formatDateTime } from "@/utils/format-date";
import type { TransactionMonitor, PaymentStatus, TransactionType } from "@/types";

const statusVariant: Record<PaymentStatus, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  success: "default",
  failed: "destructive",
  refunded: "secondary",
};

const typeLabel: Record<TransactionType, string> = {
  accommodation: "Akomodasi",
  sme_order: "UMKM",
  experience: "Pengalaman",
  facility_rental: "Sewa Fasilitas",
};

export default function TransactionsPage() {
  const router = useRouter();

  const totalAmount = mockTransactions.reduce((s, t) => s + t.amount, 0);
  const successCount = mockTransactions.filter((t) => t.status === "success").length;
  const pendingCount = mockTransactions.filter((t) => t.status === "pending").length;
  const failedCount = mockTransactions.filter((t) => t.status === "failed" || t.status === "refunded").length;

  const columns: Column<TransactionMonitor>[] = [
    {
      key: "orderId",
      header: "Order ID",
      cell: (row) => (
        <div>
          <p className="font-mono text-sm font-medium">{row.orderId}</p>
          <p className="text-muted-foreground text-xs">{typeLabel[row.type]}</p>
        </div>
      ),
    },
    {
      key: "buyer",
      header: "Pembeli",
      cell: (row) => <span className="text-sm">{row.buyerName}</span>,
    },
    {
      key: "partner",
      header: "Partner",
      cell: (row) => (
        <div>
          <p className="text-sm">{row.partnerName}</p>
          <p className="text-muted-foreground text-xs">{row.villageName}</p>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Jumlah",
      cell: (row) => <span className="text-sm font-semibold">{formatCurrency(row.amount)}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <Badge variant={statusVariant[row.status]} className="capitalize">{row.status}</Badge>
      ),
    },
    {
      key: "date",
      header: "Tanggal",
      cell: (row) => <span className="text-muted-foreground text-xs">{formatDateTime(row.createdAt)}</span>,
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
            <DropdownMenuItem onClick={() => router.push(`/transactions/${row.id}`)}>
              <Eye className="mr-2 h-4 w-4" /> Lihat Detail
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Transactions" description="Monitor transaksi platform" />

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 pt-4">
            <CreditCard className="text-muted-foreground h-8 w-8" />
            <div>
              <p className="text-muted-foreground text-xs">Total Transaksi</p>
              <p className="text-lg font-bold">{formatCurrency(totalAmount)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-muted-foreground text-xs">Berhasil</p>
              <p className="text-lg font-bold">{successCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-4">
            <TrendingUp className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="text-muted-foreground text-xs">Pending</p>
              <p className="text-lg font-bold">{pendingCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div>
              <p className="text-muted-foreground text-xs">Gagal / Refund</p>
              <p className="text-lg font-bold">{failedCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        data={mockTransactions}
        columns={columns}
        searchPlaceholder="Cari order ID atau nama..."
        searchFn={(item, q) =>
          item.orderId.toLowerCase().includes(q) ||
          item.buyerName.toLowerCase().includes(q) ||
          item.partnerName.toLowerCase().includes(q)
        }
      />
    </div>
  );
}
