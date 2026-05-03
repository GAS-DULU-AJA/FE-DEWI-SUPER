"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { mainNav } from "@/config/nav";
import { useAppStore } from "@/stores/app-store";
import { siteConfig } from "@/config/site";
import {
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);

  if (!sidebarOpen) return null;

  return (
    <aside className="bg-sidebar flex h-screen w-64 flex-col border-r border-sidebar-border">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Link href="/dashboard" className="text-xl font-bold text-sidebar-foreground">
          {siteConfig.name}
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {mainNav.map((item) => (
          <NavItem key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>
    </aside>
  );
}

function NavItem({ item, pathname }: { item: (typeof mainNav)[number]; pathname: string }) {
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
  const [expanded, setExpanded] = useState(isActive);
  const Icon = item.icon;

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isActive
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          )}
        >
          <Icon className="h-4 w-4" />
          <span className="flex-1 text-left">{item.title}</span>
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        {expanded && (
          <div className="ml-7 mt-1 space-y-1">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "block rounded-lg px-3 py-1.5 text-sm transition-colors",
                  pathname === child.href
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                {child.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{item.title}</span>
      {item.badge ? (
        <span className="bg-sidebar-primary/20 text-sidebar-primary-foreground ml-auto rounded-full px-2 py-0.5 text-xs">
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
}
