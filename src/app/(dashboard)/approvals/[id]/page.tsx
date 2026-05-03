"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApprovalDetailPanel } from "@/features/approvals/components/approval-detail-panel";
import { useApprovalDetail } from "@/features/approvals/hooks/use-approval-detail";

export default function ApprovalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: detail, isLoading, isError } = useApprovalDetail(id);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    );
  }

  if (isError || !detail) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground text-sm">Request not found.</p>
      </div>
    );
  }

  return (
    <ApprovalDetailPanel
      detail={detail}
      onApprove={() => {
        toast.success("Partnership approved successfully.");
        router.push("/approvals");
      }}
      onReject={() => {
        toast.error("Partnership request rejected.");
        router.push("/approvals");
      }}
      onRequestInfo={() => toast.info("More information requested.")}
    />
  );
}
