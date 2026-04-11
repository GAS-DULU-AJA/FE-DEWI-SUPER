export interface AuthState {
  user: import("@/types").AdminUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
