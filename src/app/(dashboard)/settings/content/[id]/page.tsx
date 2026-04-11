"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { mockContents } from "@/lib/mock-data";
import { formatDateTime } from "@/utils/format-date";
import { toast } from "sonner";

export default function ContentEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const content = mockContents.find((c) => c.id === id);
  const [body, setBody] = useState(content?.content || "");

  if (!content) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Konten tidak ditemukan</p>
      </div>
    );
  }

  const handleSave = (publishStatus: "draft" | "published") => {
    toast.success(`Konten berhasil disimpan sebagai ${publishStatus}`);
    router.push("/settings");
  };

  return (
    <div className="space-y-6">
      <PageHeader title={content.title} description={content.slug}>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
      </PageHeader>

      <div className="flex items-center gap-2">
        <Badge variant={content.status === "published" ? "default" : "secondary"}>
          {content.status === "published" ? "Published" : "Draft"}
        </Badge>
        <span className="text-muted-foreground text-sm">v{content.version}</span>
        <span className="text-muted-foreground text-sm">Terakhir diubah: {formatDateTime(content.updatedAt)}</span>
      </div>

      <Card>
        <CardHeader><CardTitle>Konten</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Isi Konten (HTML)</Label>
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={15} className="font-mono text-sm" />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleSave("draft")}>
              Simpan sebagai Draft
            </Button>
            <Button onClick={() => handleSave("published")}>
              <Save className="mr-2 h-4 w-4" /> Publish
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
