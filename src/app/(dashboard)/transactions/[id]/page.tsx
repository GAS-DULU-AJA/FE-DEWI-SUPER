"use client";

import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, CreditCard, User, Building, Clock } from "lucide-react";
import { mockTransactions } from "@/lib/mock-data";
import { formatCurrency } from "@/utils/format-currency";
import { formatDateTime } from "@/utils/format-date";
import type { PaymentStatus, TransactionType } from "@/types";

const statusVariant: Record<PaymentStatus, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline", success: "default", failed: "destructive", refunded: "secondary",
};

const typeLabel: Record<TransactionType, string> = {
  accommodation: "Akomodasi", sme_order: "UMKM", experience: "Pengalaman", facility_rental: "Sewa Fasilitas",
};

export default function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const tx = mockTransactions.find((t) => t.id === id);

  if (!tx) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Transaksi tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Detail Transaksi" description={tx.orderId}>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
      </PageHeader>

      <div className="flex items-center gap-2">
        <Badge variant={statusVariant[tx.status]} className="capitalize">{tx.status}</Badge>
        <Badge variant="outline">{typeLabel[tx.type]}</Badge>
        <Badge variant="outline">{tx.paymentMethod}</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-base">Informasi Pembayaran</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <CreditCard className="text-muted-foreground h-4 w-4" />
              <span>Provider: {tx.paymentProvider}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Jumlah</span>
              <span className="font-bold">{formatCurrency(tx.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fee Platform</span>
              <span>{formatCurrency(tx.platformFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nett Partner</span>
              <span>{formatCurrency(tx.amount - tx.platformFee)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Pembeli</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <User className="text-muted-foreground h-4 w-4" />
              <span>{tx.buyerName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-muted-foreground h-4 w-4" />
              <span>{formatDateTime(tx.createdAt)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Partner</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Building className="text-muted-foreground h-4 w-4" />
              <span>{tx.partnerName}</span>
            </div>
            <p className="text-muted-foreground">{tx.villageName}</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Split */}
      <Card>
        <CardHeader><CardTitle>Pembagian Dana</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Penerima</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead className="text-right">Persentase</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tx.splits.map((split, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{split.recipientName}</TableCell>
                  <TableCell className="capitalize">{split.recipientType}</TableCell>
                  <TableCell className="text-right">{split.percentage}%</TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(split.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Refund Info */}
      {tx.refund && (
        <Card>
          <CardHeader><CardTitle>Refund</CardTitle></CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Tipe</dt>
                <dd className="font-medium capitalize">{tx.refund.type}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Jumlah</dt>
                <dd className="font-medium">{formatCurrency(tx.refund.amount)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Status</dt>
                <dd><Badge variant="outline" className="capitalize">{tx.refund.status}</Badge></dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Alasan</dt>
                <dd>{tx.refund.reason}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}

      {/* Settlement Info */}
      {tx.settlement && (
        <Card>
          <CardHeader><CardTitle>Settlement</CardTitle></CardHeader>
          <CardContent>
            <dl className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Status</dt>
                <dd><Badge variant="outline" className="capitalize">{tx.settlement.status}</Badge></dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Jadwal</dt>
                <dd className="font-medium capitalize">{tx.settlement.schedule}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Selesai</dt>
                <dd>{tx.settlement.completedAt ? formatDateTime(tx.settlement.completedAt) : "—"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
