"use client";

import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Check, X } from "lucide-react";
import { mockRoles } from "@/lib/mock-data";
import type { PermissionModule, PermissionAction } from "@/types";

const modules: PermissionModule[] = [
  "dashboard", "users", "roles", "villages", "approvals",
  "transactions", "audit_logs", "settings", "content",
];

const actions: PermissionAction[] = ["view", "create", "update", "delete", "export", "approve"];

const moduleLabel: Record<PermissionModule, string> = {
  dashboard: "Dashboard",
  users: "Users",
  roles: "Roles",
  villages: "Villages",
  approvals: "Approvals",
  transactions: "Transactions",
  audit_logs: "Audit Logs",
  settings: "Settings",
  content: "Content",
};

export default function RoleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const role = mockRoles.find((r) => r.id === id);

  if (!role) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Role tidak ditemukan</p>
      </div>
    );
  }

  const hasAction = (mod: PermissionModule, action: PermissionAction) => {
    const perm = role.permissions.find((p) => p.module === mod);
    return perm?.actions.includes(action) ?? false;
  };

  return (
    <div className="space-y-6">
      <PageHeader title={role.name} description={role.description}>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
      </PageHeader>

      <div className="flex items-center gap-2">
        {role.isSystem && <Badge variant="secondary">System Role</Badge>}
        <Badge variant="outline">{role.userCount} pengguna</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Permission Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-40">Modul</TableHead>
                  {actions.map((a) => (
                    <TableHead key={a} className="text-center capitalize">{a}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map((mod) => (
                  <TableRow key={mod}>
                    <TableCell className="font-medium">{moduleLabel[mod]}</TableCell>
                    {actions.map((action) => (
                      <TableCell key={action} className="text-center">
                        {hasAction(mod, action) ? (
                          <Check className="mx-auto h-4 w-4 text-green-600" />
                        ) : (
                          <X className="text-muted-foreground/30 mx-auto h-4 w-4" />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
