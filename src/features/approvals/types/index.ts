// ============================================================
// Partnership Approval feature types
// ============================================================

export type PartnershipTier = "standard" | "premium" | "elite";
export type QueuePriority = "urgent" | "high" | "normal";
export type DocumentStatus = "all_uploaded" | "pending" | "missing";
export type VerificationStepStatus = "completed" | "in_progress" | "awaiting";

export interface VerificationStep {
  id: number;
  label: string;
  status: VerificationStepStatus;
  completedAt?: string;
}

export interface VerificationDocument {
  id: string;
  name: string;
  fileRef: string;
  type: "business_license" | "insurance" | "safety" | "identity" | "other";
  uploadedAt: string;
  verified: boolean;
}

export interface PropertyFacility {
  id: string;
  name: string;
  icon: string; // lucide icon name key
}

export interface PartnershipQueueItem {
  id: string;
  requestNo: string;
  propertyName: string;
  thumbnailUrl: string;
  location: string;
  country: string;
  submissionDate: string;
  documentStatus: DocumentStatus;
  pendingDocCount?: number;
  priority: QueuePriority;
  tier: PartnershipTier;
}

export interface PartnershipDetail {
  id: string;
  requestNo: string;
  propertyName: string;
  subtitle: string;
  imageUrl: string;
  tier: PartnershipTier;
  reviewStatus: string;
  description: string;
  facilities: PropertyFacility[];
  owner: {
    name: string;
    initials: string;
    role: string;
  };
  verificationFlow: VerificationStep[];
  documents: VerificationDocument[];
  auditNote?: string;
  reviewingTo: string;
  startedAt: string;
  coordinates: { lat: number; lng: number };
}

export type QueueFilter = "all" | "high_priority" | "pending_docs";
