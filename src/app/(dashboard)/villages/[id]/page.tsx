"use client";

import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft, Pencil, Phone, Mail, Globe, Star,
  Users, Building, Calendar, CreditCard,
} from "lucide-react";
import { mockVillages } from "@/lib/mock-data";
import { formatDate } from "@/utils/format-date";
import { formatCurrency } from "@/utils/format-currency";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default", pending: "outline", suspended: "destructive", inactive: "secondary",
};
const statusLabel: Record<string, string> = {
  active: "Aktif", pending: "Pending", suspended: "Suspended", inactive: "Nonaktif",
};

export default function VillageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const village = mockVillages.find((v) => v.id === id);

  if (!village) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Desa tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={village.name} description={`${village.regency}, ${village.province}`}>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
        <Button onClick={() => router.push(`/villages/${village.id}/edit`)}>
          <Pencil className="mr-2 h-4 w-4" /> Edit
        </Button>
      </PageHeader>

      <div className="flex items-center gap-2">
        <Badge variant={statusVariant[village.status]}>{statusLabel[village.status]}</Badge>
        {village.verifiedAt && (
          <Badge variant="outline">Terverifikasi {formatDate(village.verifiedAt)}</Badge>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        {[
          { icon: Users, label: "Partner", value: village.stats.totalPartners },
          { icon: Building, label: "Fasilitas", value: village.stats.totalFacilities },
          { icon: Calendar, label: "Pengalaman", value: village.stats.totalExperiences },
          { icon: CreditCard, label: "Pendapatan/Bulan", value: formatCurrency(village.stats.monthlyRevenue) },
          { icon: Star, label: "Rating", value: village.stats.averageRating > 0 ? `⭐ ${village.stats.averageRating}` : "—" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <stat.icon className="text-muted-foreground h-4 w-4" />
                <p className="text-muted-foreground text-xs">{stat.label}</p>
              </div>
              <p className="mt-1 text-xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Informasi</TabsTrigger>
          <TabsTrigger value="contact">Kontak</TabsTrigger>
          <TabsTrigger value="services">Layanan Darurat</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Informasi Umum</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{village.description}</p>
              {village.history && (
                <>
                  <Separator />
                  <div>
                    <h4 className="mb-1 text-sm font-semibold">Sejarah</h4>
                    <p className="text-muted-foreground text-sm">{village.history}</p>
                  </div>
                </>
              )}
              <Separator />
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Alamat</dt>
                  <dd>{village.address}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Koordinat</dt>
                  <dd>{village.latitude}, {village.longitude}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Informasi Kontak</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="text-muted-foreground h-4 w-4" />
                <span>{village.contact.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="text-muted-foreground h-4 w-4" />
                <span>{village.contact.email}</span>
              </div>
              {village.contact.website && (
                <div className="flex items-center gap-2">
                  <Globe className="text-muted-foreground h-4 w-4" />
                  <span>{village.contact.website}</span>
                </div>
              )}
              {village.contact.socialMedia && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <p className="font-semibold">Media Sosial</p>
                    {village.contact.socialMedia.instagram && <p>Instagram: {village.contact.socialMedia.instagram}</p>}
                    {village.contact.socialMedia.facebook && <p>Facebook: {village.contact.socialMedia.facebook}</p>}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Layanan Darurat</CardTitle></CardHeader>
            <CardContent>
              {village.governmentServices.length === 0 ? (
                <p className="text-muted-foreground text-sm">Belum ada data layanan darurat</p>
              ) : (
                <div className="space-y-3">
                  {village.governmentServices.map((svc, i) => (
                    <div key={i} className="flex items-start justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">{svc.name}</p>
                        <p className="text-muted-foreground text-xs capitalize">{svc.type.replace("_", " ")}</p>
                        <p className="text-muted-foreground mt-1 text-xs">{svc.address}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {svc.isPriority && <Badge variant="destructive">Prioritas</Badge>}
                        <span className="text-sm">{svc.phone}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
