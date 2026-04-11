import {
  LayoutDashboard,
  Users,
  Shield,
  MapPin,
  ClipboardCheck,
  CreditCard,
  ScrollText,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  children?: Omit<NavItem, "icon" | "children">[];
}

export const mainNav: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
  },
  {
    title: "Roles & Permissions",
    href: "/roles",
    icon: Shield,
  },
  {
    title: "Villages",
    href: "/villages",
    icon: MapPin,
  },
  {
    title: "Approvals",
    href: "/approvals",
    icon: ClipboardCheck,
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: CreditCard,
  },
  {
    title: "Audit Logs",
    href: "/audit-logs",
    icon: ScrollText,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    children: [
      { title: "General", href: "/settings/app" },
      { title: "Payment", href: "/settings/payment" },
      { title: "Notifications", href: "/settings/notifications" },
      { title: "Feature Flags", href: "/settings/features" },
      { title: "Maintenance", href: "/settings/maintenance" },
      { title: "Content (TnC, Privacy)", href: "/settings/content" },
    ],
  },
];
