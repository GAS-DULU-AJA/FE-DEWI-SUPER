import { HOMEPAGE_AD_REQUESTS } from "./mock-data";
import type {
  AdvertisementApprovalStatus,
  AdvertisementOwnerRole,
  AdvertisementPlacement,
  HomepageAdvertisementRequest,
} from "./types";

export function getHomepageAdRequests() {
  return HOMEPAGE_AD_REQUESTS;
}

export function formatAdRole(role: AdvertisementOwnerRole) {
  const labels: Record<AdvertisementOwnerRole, string> = {
    village: "Village",
    accommodation: "Accommodation",
    sme: "SME",
    experience: "Experience",
    transport: "Transport",
  };

  return labels[role];
}

export function formatAdPlacement(placement: AdvertisementPlacement) {
  const labels: Record<AdvertisementPlacement, string> = {
    hero: "Hero Banner",
    featured: "Featured",
    sidebar: "Sidebar",
  };

  return labels[placement];
}

export function formatAdStatus(status: AdvertisementApprovalStatus) {
  const labels: Record<AdvertisementApprovalStatus, string> = {
    draft: "Draft",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
  };

  return labels[status];
}

export function summarizeAdRequests(requests: HomepageAdvertisementRequest[]) {
  return {
    total: requests.length,
    pending: requests.filter((request) => request.status === "pending").length,
    approved: requests.filter((request) => request.status === "approved").length,
  };
}
