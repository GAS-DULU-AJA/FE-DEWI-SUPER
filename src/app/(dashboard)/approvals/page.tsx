"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { mockApprovals } from "@/lib/mock-data";
import { formatDateTime } from "@/utils/format-date";
import type { ApprovalRequest, ApprovalStatus } from "@/types";

const statusConfig: Record<ApprovalStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ElementType }> = {
  pending: { label: "Pending", variant: "outline", icon: Clock },
  under_review: { label: "Dalam Review", variant: "secondary", icon: AlertTriangle },
  approved: { label: "Disetujui", variant: "default", icon: CheckCircle },
  revision_required: { label: "Revisi", variant: "outline", icon: AlertTriangle },
  rejected: { label: "Ditolak", variant: "destructive", icon: XCircle },
};

const typeLabel: Record<string, string> = {
  partner_registration: "Registrasi Partner",
  village_registration: "Registrasi Desa",
  accommodation_submission: "Pengajuan Akomodasi",
  experience_coordination: "Koordinasi Pengalaman",
  withdrawal_request: "Pencairan Dana",
};

function ApprovalCard({ approval }: { approval: ApprovalRequest }) {
  const router = useRouter();
  const cfg = statusConfig[approval.status];
  const Icon = cfg.icon;

  return (
    <Card className="cursor-pointer transition-shadow hover:shadow-md" onClick={() => router.push(`/approvals/${approval.id}`)}>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{approval.applicant.name}</h3>
              <Badge variant={cfg.variant}>
                <Icon className="mr-1 h-3 w-3" /> {cfg.label}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1 text-sm">{typeLabel[approval.type]}</p>
            {approval.villageName && (
              <p className="text-muted-foreground text-xs">Desa: {approval.villageName}</p>
            )}
            <div className="mt-3 flex items-center gap-4 text-xs">
              <span className="text-muted-foreground">Role: {approval.partnerRole}</span>
              <span className="text-muted-foreground">Skor: {approval.completionScore}%</span>
              <span className="text-muted-foreground">{formatDateTime(approval.submittedAt)}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); router.push(`/approvals/${approval.id}`); }}>
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ApprovalsPage() {
  const [tab, setTab] = useState("all");

  const filtered = tab === "all" ? mockApprovals : mockApprovals.filter((a) => a.status === tab);

  const counts: Record<string, number> = {
    all: mockApprovals.length,
    pending: mockApprovals.filter((a) => a.status === "pending").length,
    under_review: mockApprovals.filter((a) => a.status === "under_review").length,
    approved: mockApprovals.filter((a) => a.status === "approved").length,
    rejected: mockApprovals.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Approvals" description="Kelola permintaan approval partner" />

      <Tabs value={tab} onValueChange={(v) => v && setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="all">Semua ({counts.all})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
          <TabsTrigger value="under_review">Review ({counts.under_review})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({counts.approved})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({counts.rejected})</TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="mt-4">
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="bg-muted/50 flex min-h-[200px] items-center justify-center rounded-lg border border-dashed">
                <p className="text-muted-foreground">Tidak ada approval</p>
              </div>
            ) : (
              filtered.map((a) => <ApprovalCard key={a.id} approval={a} />)
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
