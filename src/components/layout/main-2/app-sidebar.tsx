"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  ClipboardCheck,
  Users,
  Settings,
  LogOut,
  UserCircle,
  FileText,
  TrendingUp,
  Shield,
  Building,
  GalleryVerticalEnd,
  AudioWaveform,
  Command,
} from "lucide-react"

import { NavMain } from "@/components/layout/main-2/nav-main"
import { NavProjects } from "@/components/layout/main-2/nav-projects"
import { NavUser } from "@/components/layout/main-2/nav-user"
import { TeamSwitcher } from "@/components/layout/main-2/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const userRole = session?.user?.role

  // Define routes based on user role
  const getRoutes = () => {
    const baseRoutes = [
      {
        title: "Panel Principal",
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive: true,
        items: [
          {
            title: "Resumen",
            url: "/dashboard",
          },
        ],
      },
    ]

    if (userRole === "admin") {
      return [
        ...baseRoutes,
        {
          title: "Aplicaciones",
          url: "/applications",
          icon: FileText,
          items: [
            {
              title: "Todas las Aplicaciones",
              url: "/applications",
            },
            {
              title: "Pendientes de Revisión",
              url: "/applications?status=pending",
            },
            {
              title: "Aprobadas",
              url: "/applications?status=approved",
            },
            {
              title: "Rechazadas",
              url: "/applications?status=rejected",
            },
          ],
        },
        {
          title: "Usuarios",
          url: "/users",
          icon: Users,
          items: [
            {
              title: "Todos los Usuarios",
              url: "/users",
            },
            {
              title: "Emprendedores",
              url: "/users?role=entrepreneur",
            },
            {
              title: "Administradores",
              url: "/users?role=admin",
            },
          ],
        },
        {
          title: "Reportes",
          url: "/reports",
          icon: TrendingUp,
          items: [
            {
              title: "Analíticas",
              url: "/reports",
            },
            {
              title: "Rendimiento",
              url: "/reports/performance",
            },
            {
              title: "Tendencias",
              url: "/reports/trends",
            },
          ],
        },
        {
          title: "Configuración",
          url: "/settings",
          icon: Settings,
          items: [
            {
              title: "General",
              url: "/settings",
            },
            {
              title: "Seguridad",
              url: "/settings/security",
            },
            {
              title: "Notificaciones",
              url: "/settings/notifications",
            },
            {
              title: "Sistema",
              url: "/settings/system",
            },
          ],
        },
      ]
    }

    if (userRole === "entrepreneur") {
      return [
        ...baseRoutes,
        {
          title: "Mis Aplicaciones",
          url: "/applications",
          icon: ClipboardCheck,
          items: [
            {
              title: "Todas las Aplicaciones",
              url: "/applications",
            },
            {
              title: "Borrador",
              url: "/applications?status=draft",
            },
            {
              title: "Enviadas",
              url: "/applications?status=submitted",
            },
            {
              title: "En Revisión",
              url: "/applications?status=review",
            },
            {
              title: "Aprobadas",
              url: "/applications?status=approved",
            },
            {
              title: "Rechazadas",
              url: "/applications?status=rejected",
            },
          ],
        },
        {
          title: "Mi Equipo",
          url: "/team",
          icon: Users,
          items: [
            {
              title: "Miembros del Equipo",
              url: "/team",
            },
            {
              title: "Invitaciones",
              url: "/team/invitations",
            },
            {
              title: "Roles y Permisos",
              url: "/team/roles",
            },
          ],
        },
        {
          title: "Configuración",
          url: "/settings",
          icon: Settings,
          items: [
            {
              title: "Perfil",
              url: "/settings",
            },
            {
              title: "Cuenta",
              url: "/settings/account",
            },
            {
              title: "Seguridad",
              url: "/settings/security",
            },
            {
              title: "Notificaciones",
              url: "/settings/notifications",
            },
          ],
        },
      ]
    }

    // Default routes for unknown roles
    return baseRoutes
  }

  // Sample teams data - you can replace this with actual data
  const teams = [
    {
      name: "Plataforma StartupC",
      logo: GalleryVerticalEnd,
      plan: "Empresa",
    },
    {
      name: "Equipo de Desarrollo",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Equipo de Soporte",
      logo: Command,
      plan: "Gratuito",
    },
  ]

  // User data from session
  const userData = {
    name: session?.user?.firstname && session?.user?.lastname 
      ? `${session.user.firstname} ${session.user.lastname}`
      : session?.user?.name || "Usuario",
    email: session?.user?.email || "",
    avatar: session?.user?.image || "",
    role: userRole,
  }

  const routes = getRoutes()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={routes} />
        <NavProjects projects={[]} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
