// ============================================================
// Shared types for Admin DeWi platform
// ============================================================

// --- Enums / Union Types ---
export type AdminRole = "super_admin" | "admin" | "finance_admin" | "support" | "viewer";
export type PartnerRole = "VILLAGE_ADMIN" | "ACCOMMODATION" | "UMKM" | "EVENT_ORGANIZER";
export type UserStatus = "active" | "inactive" | "suspended" | "pending_verification";

export type PermissionModule =
  | "users"
  | "roles"
  | "villages"
  | "approvals"
  | "transactions"
  | "audit_logs"
  | "settings"
  | "dashboard"
  | "content";

export type PermissionAction = "view" | "create" | "update" | "delete" | "export" | "approve";

export type ApprovalType =
  | "partner_registration"
  | "village_registration"
  | "accommodation_submission"
  | "experience_coordination"
  | "withdrawal_request";

export type ApprovalStatus = "pending" | "under_review" | "approved" | "revision_required" | "rejected";

export type TransactionType = "accommodation" | "sme_order" | "experience" | "facility_rental";
export type PaymentStatus = "pending" | "success" | "failed" | "refunded";
export type PaymentProvider = "midtrans" | "xendit" | "doku";

export type AuditAction =
  | "login"
  | "logout"
  | "create"
  | "update"
  | "delete"
  | "approve"
  | "reject"
  | "export"
  | "bulk_action"
  | "settings_change"
  | "password_reset"
  | "role_change";

export type ContentSlug =
  | "terms-and-conditions"
  | "privacy-policy"
  | "refund-policy"
  | "about-us"
  | "faq"
  | "contact"
  | "partner-guidelines"
  | "community-guidelines";

// --- Core Interfaces ---
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: AdminRole;
  partnerRole?: PartnerRole;
  villageId?: string;
  villageName?: string;
  status: UserStatus;
  isApproved: boolean;
  emailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  module: PermissionModule;
  actions: PermissionAction[];
}

export interface Role {
  id: string;
  name: string;
  slug: AdminRole;
  description: string;
  permissions: Permission[];
  userCount: number;
  isSystem: boolean;
  createdAt: string;
}

export interface ApprovalChecklist {
  businessInfo: boolean;
  documents: boolean;
  location: boolean;
  financial: boolean;
  media: boolean;
}

export interface ApprovalDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface ApprovalRequest {
  id: string;
  type: ApprovalType;
  applicant: {
    userId: string;
    name: string;
    email: string;
    phone: string;
  };
  villageId?: string;
  villageName?: string;
  partnerRole: PartnerRole;
  status: ApprovalStatus;
  completionScore: number;
  checklist: ApprovalChecklist;
  documents: ApprovalDocument[];
  reviewedBy?: string;
  reviewNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface PaymentSplit {
  recipientType: "partner" | "village" | "platform";
  recipientId: string;
  recipientName: string;
  amount: number;
  percentage: number;
}

export interface TransactionMonitor {
  id: string;
  orderId: string;
  type: TransactionType;
  status: PaymentStatus;
  amount: number;
  currency: "IDR";
  platformFee: number;
  paymentMethod: string;
  paymentProvider: PaymentProvider;
  buyerUserId: string;
  buyerName: string;
  partnerUserId: string;
  partnerName: string;
  villageId: string;
  villageName: string;
  splits: PaymentSplit[];
  refund?: {
    type: "full" | "partial";
    amount: number;
    reason: string;
    status: "pending" | "approved" | "processed" | "rejected";
    requestedAt: string;
    processedAt?: string;
  };
  settlement?: {
    status: "pending" | "processing" | "completed";
    schedule: "standard" | "express" | "instant";
    completedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GovernmentService {
  type: "clinic" | "hospital" | "fire_department" | "police" | "pharmacy";
  name: string;
  phone: string;
  address: string;
  isPriority: boolean;
  coordinates?: { latitude: number; longitude: number };
}

export interface VillageManagement {
  id: string;
  name: string;
  slug: string;
  address: string;
  province: string;
  regency: string;
  district: string;
  latitude: number;
  longitude: number;
  description: string;
  history?: string;
  contact: {
    phone: string;
    email: string;
    website?: string;
    socialMedia?: {
      instagram?: string;
      facebook?: string;
      youtube?: string;
    };
  };
  gallery: string[];
  videoUrl?: string;
  bankInfo?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  governmentServices: GovernmentService[];
  status: "pending" | "active" | "suspended" | "inactive";
  verifiedAt?: string;
  stats: {
    totalPartners: number;
    totalFacilities: number;
    totalExperiences: number;
    monthlyRevenue: number;
    averageRating: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: AdminRole | PartnerRole;
  action: AuditAction;
  module: PermissionModule;
  resourceType: string;
  resourceId: string;
  description: string;
  metadata: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  status: "success" | "failed";
}

export interface WebContent {
  id: string;
  slug: ContentSlug;
  title: string;
  content: string;
  status: "draft" | "published";
  version: number;
  locale: "id" | "en";
  publishedAt?: string;
  lastEditedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: AdminUser | null;
  accessToken: string | null;
  permissions: Permission[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
}
