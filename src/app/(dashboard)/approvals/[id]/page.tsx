"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft, CheckCircle, XCircle, AlertTriangle, FileText,
  Mail, Phone, User, MapPin, Clock,
} from "lucide-react";
import { mockApprovals } from "@/lib/mock-data";
import { formatDateTime } from "@/utils/format-date";
import { usePermission } from "@/hooks/use-permission";
import { toast } from "sonner";
import type { ApprovalStatus } from "@/types";

const statusConfig: Record<ApprovalStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pending", variant: "outline" },
  under_review: { label: "Dalam Review", variant: "secondary" },
  approved: { label: "Disetujui", variant: "default" },
  revision_required: { label: "Revisi Diperlukan", variant: "outline" },
  rejected: { label: "Ditolak", variant: "destructive" },
};

const typeLabel: Record<string, string> = {
  partner_registration: "Registrasi Partner",
  village_registration: "Registrasi Desa",
  accommodation_submission: "Pengajuan Akomodasi",
  experience_coordination: "Koordinasi Pengalaman",
  withdrawal_request: "Pencairan Dana",
};

export default function ApprovalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const canApprove = usePermission("approvals", "approve");
  const approval = mockApprovals.find((a) => a.id === id);
  const [notes, setNotes] = useState("");

  if (!approval) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Approval tidak ditemukan</p>
      </div>
    );
  }

  const cfg = statusConfig[approval.status];
  const isPending = approval.status === "pending" || approval.status === "under_review";

  const handleAction = (action: "approved" | "revision_required" | "rejected") => {
    const labels = { approved: "disetujui", revision_required: "diminta revisi", rejected: "ditolak" };
    toast.success(`Approval ${labels[action]}`);
    router.push("/approvals");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Detail Approval" description={typeLabel[approval.type]}>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
      </PageHeader>

      <div className="flex items-center gap-2">
        <Badge variant={cfg.variant}>{cfg.label}</Badge>
        <Badge variant="outline">{approval.partnerRole}</Badge>
        <span className="text-muted-foreground text-sm">Skor: {approval.completionScore}%</span>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Applicant Info */}
        <Card>
          <CardHeader><CardTitle className="text-base">Pemohon</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <User className="text-muted-foreground h-4 w-4" />
              <span>{approval.applicant.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="text-muted-foreground h-4 w-4" />
              <span>{approval.applicant.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="text-muted-foreground h-4 w-4" />
              <span>{approval.applicant.phone}</span>
            </div>
            {approval.villageName && (
              <div className="flex items-center gap-2">
                <MapPin className="text-muted-foreground h-4 w-4" />
                <span>{approval.villageName}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="text-muted-foreground h-4 w-4" />
              <span>Diajukan: {formatDateTime(approval.submittedAt)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Checklist */}
        <Card>
          <CardHeader><CardTitle className="text-base">Checklist Kelengkapan</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(approval.checklist).map(([key, val]) => (
              <div key={key} className="flex items-center gap-2 text-sm">
                {val ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="text-muted-foreground/50 h-4 w-4" />
                )}
                <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader><CardTitle className="text-base">Dokumen</CardTitle></CardHeader>
          <CardContent>
            {approval.documents.length === 0 ? (
              <p className="text-muted-foreground text-sm">Tidak ada dokumen</p>
            ) : (
              <div className="space-y-2">
                {approval.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-2 rounded border p-2 text-sm">
                    <FileText className="text-muted-foreground h-4 w-4" />
                    <div className="flex-1">
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-muted-foreground text-xs">{doc.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Review Notes (if previously reviewed) */}
      {approval.reviewNotes && (
        <Card>
          <CardHeader><CardTitle className="text-base">Catatan Review</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm">{approval.reviewNotes}</p>
            {approval.reviewedAt && (
              <p className="text-muted-foreground mt-2 text-xs">Direview: {formatDateTime(approval.reviewedAt)}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {canApprove && isPending && (
        <Card>
          <CardHeader><CardTitle className="text-base">Tindakan</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Catatan (opsional)</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Tambahkan catatan review..." rows={3} />
            </div>
            <Separator />
            <div className="flex gap-2">
              <Button onClick={() => handleAction("approved")}>
                <CheckCircle className="mr-2 h-4 w-4" /> Setujui
              </Button>
              <Button variant="outline" onClick={() => handleAction("revision_required")}>
                <AlertTriangle className="mr-2 h-4 w-4" /> Minta Revisi
              </Button>
              <Button variant="destructive" onClick={() => handleAction("rejected")}>
                <XCircle className="mr-2 h-4 w-4" /> Tolak
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
