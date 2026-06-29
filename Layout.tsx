// NIC — Main Layout with Sidebar
// Design: Warm Intelligence — navy sidebar, cream content area

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  Mic,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const LOGO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663787055906/3pJt9zv94boB9Dx5vobPWL/logo-icon-B9MnaJPcsvWcZherbP4FsN.webp";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Users, label: "Clients", href: "/clients" },
  { icon: Calendar, label: "Appointments", href: "/appointments" },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [location] = useLocation();

  return (
    <div className="flex h-screen bg-[#FAFAF8] overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col bg-[#1E3A5F] text-white transition-all duration-250 ease-out shrink-0 relative z-20",
          collapsed ? "w-16" : "w-56"
        )}
        style={{ transition: "width 250ms cubic-bezier(0.23, 1, 0.32, 1)" }}
      >
        {/* Logo */}
        <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-white/10", collapsed && "justify-center px-2")}>
          <img src={LOGO_URL} alt="NIC" className="w-8 h-8 shrink-0 invert brightness-200" />
          {!collapsed && (
            <div className="overflow-hidden">
              <span className="text-sm font-semibold tracking-wide text-white whitespace-nowrap">NIC</span>
              <p className="text-[10px] text-white/50 whitespace-nowrap">Copilot for Advisors</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map(({ icon: Icon, label, href }) => {
            const active = location === href || (href !== "/" && location.startsWith(href));
            return (
              <Link key={href} href={href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150",
                    active
                      ? "bg-white/15 text-white"
                      : "text-white/60 hover:bg-white/10 hover:text-white",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <Icon size={18} className="shrink-0" />
                  {!collapsed && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-2 border-t border-white/10 space-y-1">
          <div
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-white cursor-pointer transition-all duration-150",
              collapsed && "justify-center px-2"
            )}
          >
            <Settings size={18} className="shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Settings</span>}
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#1E3A5F] border border-white/20 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors z-30 shadow-md"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              Fri, 3 Jul 2026
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Bell size={18} className="text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-100">
              <div className="w-8 h-8 rounded-full bg-[#1A325A] flex items-center justify-center text-white text-xs font-semibold">
                FA
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-800">Faith Ang</p>
                <p className="text-xs text-gray-400">Financial Advisor</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
