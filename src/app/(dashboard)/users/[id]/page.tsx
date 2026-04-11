"use client";

import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Pencil, Mail, Phone, MapPin, Shield, Calendar } from "lucide-react";
import { mockUsers } from "@/lib/mock-data";
import { formatDate, formatDateTime } from "@/utils/format-date";
import type { UserStatus, AdminRole } from "@/types";

const statusVariant: Record<UserStatus, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  inactive: "secondary",
  suspended: "destructive",
  pending_verification: "outline",
};

const statusLabel: Record<UserStatus, string> = {
  active: "Aktif",
  inactive: "Nonaktif",
  suspended: "Suspended",
  pending_verification: "Menunggu Verifikasi",
};

const roleLabel: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  finance_admin: "Finance Admin",
  support: "Support",
  viewer: "Viewer",
};

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const user = mockUsers.find((u) => u.id === id);

  if (!user) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">User tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Detail User" description={user.name}>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
        <Button onClick={() => router.push(`/users/${user.id}/edit`)}>
          <Pencil className="mr-2 h-4 w-4" /> Edit
        </Button>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardContent className="flex flex-col items-center pt-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">
                {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
            <Badge variant={statusVariant[user.status]} className="mt-2">
              {statusLabel[user.status]}
            </Badge>
            <Separator className="my-4 w-full" />
            <div className="w-full space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="text-muted-foreground h-4 w-4" />
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="text-muted-foreground h-4 w-4" />
                  <span>{user.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Shield className="text-muted-foreground h-4 w-4" />
                <span>{roleLabel[user.role]}</span>
                {user.partnerRole && (
                  <Badge variant="outline" className="ml-1 text-xs">{user.partnerRole}</Badge>
                )}
              </div>
              {user.villageName && (
                <div className="flex items-center gap-2">
                  <MapPin className="text-muted-foreground h-4 w-4" />
                  <span>{user.villageName}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="text-muted-foreground h-4 w-4" />
                <span>Bergabung {formatDate(user.createdAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informasi Akun</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Email Terverifikasi</dt>
                <dd className="font-medium">{user.emailVerified ? "Ya" : "Belum"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Disetujui</dt>
                <dd className="font-medium">{user.isApproved ? "Ya" : "Belum"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Login Terakhir</dt>
                <dd className="font-medium">
                  {user.lastLoginAt ? formatDateTime(user.lastLoginAt) : "Belum pernah login"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Terakhir Diperbarui</dt>
                <dd className="font-medium">{formatDateTime(user.updatedAt)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
