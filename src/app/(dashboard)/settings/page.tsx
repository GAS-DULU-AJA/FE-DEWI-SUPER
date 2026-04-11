"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, FileText, Eye } from "lucide-react";
import { mockContents } from "@/lib/mock-data";
import { formatDateTime } from "@/utils/format-date";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [platformName, setPlatformName] = useState("Desa Wisata Indonesia");
  const [platformFee, setPlatformFee] = useState("15");
  const [currency, setCurrency] = useState("IDR");
  const [maintenance, setMaintenance] = useState(false);

  const handleSave = () => {
    toast.success("Pengaturan berhasil disimpan");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Pengaturan aplikasi dan konten" />

      <Tabs defaultValue="app">
        <TabsList>
          <TabsTrigger value="app">Aplikasi</TabsTrigger>
          <TabsTrigger value="payment">Pembayaran</TabsTrigger>
          <TabsTrigger value="content">Konten Web</TabsTrigger>
        </TabsList>

        <TabsContent value="app" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Umum</CardTitle>
              <CardDescription>Konfigurasi dasar platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="platformName">Nama Platform</Label>
                  <Input id="platformName" value={platformName} onChange={(e) => setPlatformName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Mata Uang</Label>
                  <Select value={currency} onValueChange={(v) => v && setCurrency(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IDR">IDR - Rupiah Indonesia</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Mode Maintenance</p>
                  <p className="text-muted-foreground text-sm">Aktifkan untuk menonaktifkan akses publik</p>
                </div>
                <Button
                  variant={maintenance ? "destructive" : "outline"}
                  onClick={() => setMaintenance(!maintenance)}
                >
                  {maintenance ? "Matikan" : "Aktifkan"}
                </Button>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" /> Simpan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Pembayaran</CardTitle>
              <CardDescription>Konfigurasi fee dan payment gateway</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fee">Platform Fee (%)</Label>
                  <Input id="fee" type="number" min="0" max="100" value={platformFee} onChange={(e) => setPlatformFee(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Payment Provider</Label>
                  <div className="flex gap-2 pt-2">
                    <Badge variant="default">Midtrans</Badge>
                    <Badge variant="secondary">Xendit</Badge>
                    <Badge variant="outline">Doku</Badge>
                  </div>
                </div>
              </div>
              <Separator />
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Min. Pencairan</dt>
                  <dd className="font-medium">Rp 50.000</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Jadwal Settlement</dt>
                  <dd className="font-medium">D+3 (Standard)</dd>
                </div>
              </dl>
              <div className="flex justify-end">
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" /> Simpan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Konten Platform</CardTitle>
              <CardDescription>Kelola halaman statis dan kebijakan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockContents.map((content) => (
                  <div key={content.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="text-muted-foreground h-5 w-5" />
                      <div>
                        <p className="font-medium">{content.title}</p>
                        <p className="text-muted-foreground text-xs">
                          v{content.version} · {formatDateTime(content.updatedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={content.status === "published" ? "default" : "secondary"}>
                        {content.status === "published" ? "Published" : "Draft"}
                      </Badge>
                      <Button variant="ghost" size="icon" onClick={() => router.push(`/settings/content/${content.id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
