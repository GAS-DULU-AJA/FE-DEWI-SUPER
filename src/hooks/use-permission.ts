"use client";

import { useAuthStore } from "@/stores/auth-store";
import type { PermissionModule, PermissionAction } from "@/types";

export function usePermission(module: PermissionModule, action: PermissionAction): boolean {
  const permissions = useAuthStore((s) => s.permissions);
  const perm = permissions.find((p) => p.module === module);
  if (!perm) return false;
  return perm.actions.includes(action);
}

export function usePermissions(module: PermissionModule): PermissionAction[] {
  const permissions = useAuthStore((s) => s.permissions);
  const perm = permissions.find((p) => p.module === module);
  return perm?.actions || [];
}
