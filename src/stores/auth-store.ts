"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AdminUser, Permission, AuthState } from "@/types";
import { mockUsers, defaultPermissions } from "@/lib/mock-data";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      permissions: [],
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, _password: string) => {
        set({ isLoading: true });
        // Simulate API call
        await new Promise((r) => setTimeout(r, 800));

        const user = mockUsers.find((u) => u.email === email);
        if (!user) {
          set({ isLoading: false });
          throw new Error("Email atau password salah");
        }

        const permissions = defaultPermissions[user.role] || [];
        set({
          user,
          accessToken: `mock-jwt-${Date.now()}`,
          permissions,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          permissions: [],
          isAuthenticated: false,
        });
      },

      refreshSession: async () => {
        const { user } = get();
        if (!user) return;
        set({ accessToken: `mock-jwt-${Date.now()}` });
      },
    }),
    {
      name: "admin-dewi-auth",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        permissions: state.permissions,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
