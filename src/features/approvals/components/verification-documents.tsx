import { FileText, Download, ShieldCheck } from "lucide-react";
import type { VerificationDocument } from "../types";

interface VerificationDocumentsProps {
  documents: VerificationDocument[];
}

const typeIcon: Record<string, React.ElementType> = {
  business_license: FileText,
  insurance: ShieldCheck,
  safety: ShieldCheck,
  identity: FileText,
  other: FileText,
};

export function VerificationDocuments({ documents }: VerificationDocumentsProps) {
  return (
    <div className="space-y-2">
      {documents.map((doc) => {
        const Icon = typeIcon[doc.type] ?? FileText;
        return (
          <div
            key={doc.id}
            className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2"
          >
            <div className="flex items-center gap-2.5">
              <div className="rounded-md bg-primary/10 p-1.5 text-primary">
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">{doc.name}</p>
                <p className="text-[10px] text-muted-foreground">{doc.fileRef}</p>
              </div>
            </div>
            <button className="text-muted-foreground transition-colors hover:text-foreground">
              <Download className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
