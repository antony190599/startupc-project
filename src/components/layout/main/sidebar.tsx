"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  ClipboardCheck,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  UserCircle,
  FileText,
  TrendingUp,
  Shield,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SidebarProps = {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
};

export function Sidebar({ isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const userRole = session?.user?.role;

  // Define routes based on user role
  const getRoutes = () => {
    const baseRoutes = [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
        active: pathname === "/dashboard",
      },
    ];

    if (userRole === "admin") {
      return [
        ...baseRoutes,
        {
          href: "/applications",
          label: "Aplicaciones",
          icon: <FileText className="h-5 w-5" />,
          active: pathname === "/dashboard/applications",
        },
        {
          href: "/users",
          label: "Usuarios",
          icon: <Users className="h-5 w-5" />,
          active: pathname === "/dashboard/users",
        },
        {
          href: "/reports",
          label: "Reportes",
          icon: <TrendingUp className="h-5 w-5" />,
          active: pathname === "/dashboard/reports",
        },
        {
          href: "/settings",
          label: "Configuración",
          icon: <Settings className="h-5 w-5" />,
          active: pathname === "/dashboard/settings",
        },
      ];
    }

    if (userRole === "entrepreneur") {
      return [
        ...baseRoutes,
        {
          href: "/applications",
          label: "Mis Aplicaciones",
          icon: <ClipboardCheck className="h-5 w-5" />,
          active: pathname === "/dashboard/applications",
        },
        {
          href: "/team",
          label: "Mis Equipos",
          icon: <Users className="h-5 w-5" />,
          active: pathname === "/dashboard/team",
        },
        {
          href: "/settings",
          label: "Configuración",
          icon: <Settings className="h-5 w-5" />,
          active: pathname === "/dashboard/settings",
        },
      ];
    }

    // Default routes for unknown roles
    return baseRoutes;
  };

  const routes = getRoutes();

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-sidebar border-r border-sidebar-border shadow-sm transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        {/* Logo and app name */}
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="rounded-lg bg-primary p-1">
              <div className="h-6 w-6 text-primary-foreground grid place-items-center font-bold">
                SC
              </div>
            </div>
            <span className="font-semibold text-lg text-sidebar-foreground">
              StartupC
            </span>
          </Link>
        </div>

        {/* Role indicator */}
        {userRole && (
          <div className="px-6 py-2 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              {userRole === "admin" ? (
                <Shield className="h-4 w-4 text-blue-500" />
              ) : (
                <Building className="h-4 w-4 text-green-500" />
              )}
              <span className="text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wide">
                {userRole === "admin" ? "Administrador" : "Emprendedor"}
              </span>
            </div>
          </div>
        )}

        {/* Navigation links */}
        <div className="flex-1 overflow-auto py-4 px-4">
          <nav className="flex flex-col gap-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  route.active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                {route.icon}
                <span>{route.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* User profile section */}
        <div className="mt-auto border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-md px-3 py-2">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <UserCircle className="h-8 w-8 text-sidebar-foreground" />
            )}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-sidebar-foreground">
                {session?.user?.firstname && session?.user?.lastname 
                  ? `${session.user.firstname} ${session.user.lastname}`
                  : session?.user?.name || "Usuario"
                }
              </span>
              <span className="text-xs text-sidebar-foreground/70">
                {session?.user?.email || ""}
              </span>
            </div>
          </div>

          {/* Logout button */}
          <Link
            href="javascript:void(0)"
            onClick={() => signOut()}
            className={cn(
              "mt-2 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors"
            )}
          >
            <LogOut className="h-5 w-5" />
            <span>Cerrar sesión</span>
          </Link>
        </div>
      </div>
    </>
  );
}
