"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ChevronRight,
  Waves,
  Sparkles,
  UtensilsCrossed,
  Crown,
  Clock,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VerificationFlow } from "./verification-flow";
import { VerificationDocuments } from "./verification-documents";
import { LocationIntegrityMap } from "./location-integrity-map";
import type { PartnershipDetail } from "../types";

// Map facility icon keys to Lucide components
const FACILITY_ICONS: Record<string, React.ElementType> = {
  waves: Waves,
  sparkles: Sparkles,
  "utensils-crossed": UtensilsCrossed,
};

const TIER_STYLES: Record<string, string> = {
  premium: "bg-sky-50 text-sky-700 border border-sky-200",
  elite: "bg-purple-50 text-purple-700 border border-purple-200",
  standard: "bg-slate-50 text-slate-600 border border-slate-200",
};

const TIER_ICONS: Record<string, React.ElementType> = {
  premium: Crown,
  elite: Star,
  standard: Clock,
};

interface ApprovalDetailPanelProps {
  detail: PartnershipDetail;
  onApprove?: () => void;
  onReject?: () => void;
  onRequestInfo?: () => void;
}

export function ApprovalDetailPanel({
  detail,
  onApprove,
  onReject,
  onRequestInfo,
}: ApprovalDetailPanelProps) {
  const TierIcon = TIER_ICONS[detail.tier] ?? Crown;

  return (
    <div className="flex flex-col">
      {/* Breadcrumb */}
      <nav className="mb-3 flex items-center gap-1 text-xs text-muted-foreground">
        <Link href="/approvals" className="hover:text-foreground transition-colors">
          Partnerships
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/approvals" className="hover:text-foreground transition-colors">
          Verification Queue
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-primary font-medium">Request {detail.requestNo}</span>
      </nav>

      {/* Header row */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {detail.propertyName}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{detail.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
              TIER_STYLES[detail.tier],
            )}
          >
            <TierIcon className="h-3 w-3" />
            {detail.tier} Tier
          </span>
          <Badge variant="outline" className="text-xs">
            {detail.reviewStatus}
          </Badge>
        </div>
      </div>

      {/* Main 2-col layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        {/* Left column */}
        <div className="space-y-5">
          {/* Property image */}
          <div className="relative h-56 w-full overflow-hidden rounded-xl bg-muted sm:h-64">
            <Image
              src={detail.imageUrl}
              alt={detail.propertyName}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Description */}
          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Description
            </h2>
            <p className="text-sm leading-relaxed text-foreground">{detail.description}</p>
          </div>

          {/* Facilities + Owner */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Facilities
              </h2>
              <ul className="space-y-1.5">
                {detail.facilities.map((f) => {
                  const Icon = FACILITY_ICONS[f.icon] ?? Sparkles;
                  return (
                    <li key={f.id} className="flex items-center gap-2 text-sm text-foreground">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {f.name}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Owner Information
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {detail.owner.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{detail.owner.name}</p>
                  <p className="text-xs text-muted-foreground">{detail.owner.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location map */}
          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Location Integrity
            </h2>
            <LocationIntegrityMap
              propertyName={detail.propertyName}
              coordinates={detail.coordinates}
            />
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Verification Flow */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-foreground">Verification Flow</h2>
            <VerificationFlow steps={detail.verificationFlow} />
          </div>

          {/* Verification Documents */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Verification Documents</h2>
            <VerificationDocuments documents={detail.documents} />
          </div>

          {/* Audit Note */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-2 text-sm font-semibold text-foreground">Audit Note</h2>
            <Textarea
              placeholder="Add internal note for this review..."
              className="min-h-20 resize-none text-xs"
              defaultValue={detail.auditNote}
            />
          </div>
        </div>
      </div>

      <Separator className="my-5" />

      {/* Bottom action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Reviewing to{" "}
          <span className="font-semibold text-foreground">{detail.reviewingTo}</span>
          {" · "}Started {detail.startedAt}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onRequestInfo} className="text-xs">
            Request More Info
          </Button>
          <Button variant="destructive" size="sm" onClick={onReject} className="text-xs">
            Reject Property
          </Button>
          <Button
            size="sm"
            onClick={onApprove}
            className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
          >
            <Crown className="h-3.5 w-3.5" />
            Approve Partnership
          </Button>
        </div>
      </div>
    </div>
  );
}
