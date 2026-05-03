import type {
  PartnershipQueueItem,
  PartnershipDetail,
} from "../types";

// ============================================================
// Mock data — replace with real API calls
// ============================================================

export const MOCK_QUEUE: PartnershipQueueItem[] = [
  {
    id: "p1",
    requestNo: "#HR-9821",
    propertyName: "Aurelia Grand Resort",
    thumbnailUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=80&q=80",
    location: "Santorini, Greece",
    country: "Greece",
    submissionDate: "2023-10-12",
    documentStatus: "all_uploaded",
    priority: "urgent",
    tier: "premium",
  },
  {
    id: "p2",
    requestNo: "#HR-9819",
    propertyName: "The Meridian Suites",
    thumbnailUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=80&q=80",
    location: "Singapore",
    country: "Singapore",
    submissionDate: "2023-10-14",
    documentStatus: "pending",
    pendingDocCount: 2,
    priority: "normal",
    tier: "standard",
  },
  {
    id: "p3",
    requestNo: "#HR-9815",
    propertyName: "Eiger Heights Lodge",
    thumbnailUrl: "https://images.unsplash.com/photo-1518602164578-cd0074062767?w=80&q=80",
    location: "Grindelwald, Switzerland",
    country: "Switzerland",
    submissionDate: "2023-10-15",
    documentStatus: "all_uploaded",
    priority: "high",
    tier: "elite",
  },
  {
    id: "p4",
    requestNo: "#HR-9812",
    propertyName: "Azure Bay Villas",
    thumbnailUrl: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=80&q=80",
    location: "Maldives",
    country: "Maldives",
    submissionDate: "2023-10-15",
    documentStatus: "all_uploaded",
    priority: "normal",
    tier: "premium",
  },
];

export const MOCK_QUEUE_STATS = {
  pendingVerifications: 42,
  pendingDelta: "+5 since yesterday",
  averageReviewDays: 1.4,
  approvalsThisWeek: 128,
  weeklyDelta: "12% increase",
};

export const MOCK_DETAIL: PartnershipDetail = {
  id: "p1",
  requestNo: "#98231",
  propertyName: "Meridian Azure Resort",
  subtitle: "Santorini, Greece • Luxury Coastal Resort",
  imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
  tier: "premium",
  reviewStatus: "Pending Review",
  description:
    "Experience the pinnacle of Mediterranean luxury. The Meridian Azure Resort features 45 private villas, each with a heated infinity pool overlooking the Aegean Sea. Built into the volcanic cliffs of Oia, the architecture maintains traditional Cycladic forms with minimalist high-end interiors.",
  facilities: [
    { id: "f1", name: "Infinity Pool", icon: "waves" },
    { id: "f2", name: "Luxury Spa", icon: "sparkles" },
    { id: "f3", name: "Michelin Star Dining", icon: "utensils-crossed" },
  ],
  owner: {
    name: "Elena Kostas",
    initials: "EK",
    role: "Chief Executive Officer",
  },
  verificationFlow: [
    { id: 1, label: "Identity Check", status: "completed", completedAt: "Verified Oct 12, 2023" },
    { id: 2, label: "Document Review", status: "in_progress" },
    { id: 3, label: "Final Approval", status: "awaiting" },
  ],
  documents: [
    { id: "d1", name: "Business License", fileRef: "BL-88309-BL.PDF", type: "business_license", uploadedAt: "2023-10-10", verified: true },
    { id: "d2", name: "Insurance Policy", fileRef: "ACTIVE_COVERAGE.PDF", type: "insurance", uploadedAt: "2023-10-10", verified: true },
    { id: "d3", name: "Safety Certificates", fileRef: "HSE_AUDIT_2025.PDF", type: "safety", uploadedAt: "2023-10-10", verified: true },
  ],
  auditNote: "",
  reviewingTo: "Chief Admin",
  startedAt: "14 minutes ago",
  coordinates: { lat: 36.4618, lng: 25.3753 },
};

// ============================================================
// API functions
// ============================================================

export async function getPartnershipQueue(): Promise<PartnershipQueueItem[]> {
  // TODO: replace with real fetch
  await new Promise((r) => setTimeout(r, 400));
  return MOCK_QUEUE;
}

export async function getPartnershipQueueStats() {
  await new Promise((r) => setTimeout(r, 300));
  return MOCK_QUEUE_STATS;
}

export async function getPartnershipDetail(id: string): Promise<PartnershipDetail> {
  await new Promise((r) => setTimeout(r, 500));
  const found = MOCK_QUEUE.find((q) => q.id === id);
  if (!found) throw new Error("Not found");
  return { ...MOCK_DETAIL, id, requestNo: found.requestNo };
}
