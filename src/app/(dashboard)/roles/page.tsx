"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Lock, Users } from "lucide-react";
import { mockRoles } from "@/lib/mock-data";
import { useRouter } from "next/navigation";

export default function RolesPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <PageHeader title="Roles & Permissions" description="Kelola role dan hak akses" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockRoles.map((role) => {
          const totalActions = role.permissions.reduce((sum, p) => sum + p.actions.length, 0);
          return (
            <Card key={role.id} className="cursor-pointer transition-shadow hover:shadow-md" onClick={() => router.push(`/roles/${role.id}`)}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold">{role.name}</CardTitle>
                {role.isSystem && <Badge variant="secondary">System</Badge>}
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm">{role.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="text-muted-foreground h-4 w-4" />
                    <span>{role.userCount} user</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Lock className="text-muted-foreground h-4 w-4" />
                    <span>{totalActions} permission</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-4 w-full" onClick={(e) => { e.stopPropagation(); router.push(`/roles/${role.id}`); }}>
                  <Eye className="mr-2 h-4 w-4" /> Lihat Permission
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
