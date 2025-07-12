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
  BookOpen,
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
import { ProjectStatus } from "@/lib/enum"

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
              title: "Creadas",
              url: `/applications?projectStatus=${ProjectStatus.CREATED}`,
            },
            {
              title: "Pendientes de Revisión",
              url: `/applications?projectStatus=${ProjectStatus.PENDING_INTAKE}`,
            },
            {
              title: "En Revisión Técnica",
              url: `/applications?projectStatus=${ProjectStatus.TECHNICAL_REVIEW}`,
            },
            {
              title: "Aprobadas",
              url: `/applications?projectStatus=${ProjectStatus.APPROVED}`,
            },
            {
              title: "Aceptadas",
              url: `/applications?projectStatus=${ProjectStatus.ACCEPTED}`,
            },
            {
              title: "Rechazadas",
              url: `/applications?projectStatus=${ProjectStatus.REJECTED}`,
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
          title: "Programas",
          url: "/programs",
          icon: BookOpen,
          items: [
            {
              title: "Todos los Programas",
              url: "/programs",
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
              title: "Creadas",
              url: `/applications?projectStatus=${ProjectStatus.CREATED}`,
            },
            {
              title: "Pendientes de Revisión",
              url: `/applications?projectStatus=${ProjectStatus.PENDING_INTAKE}`,
            },
            {
              title: "En Revisión Técnica",
              url: `/applications?projectStatus=${ProjectStatus.TECHNICAL_REVIEW}`,
            },
            {
              title: "Aprobadas",
              url: `/applications?projectStatus=${ProjectStatus.APPROVED}`,
            },
            {
              title: "Aceptadas",
              url: `/applications?projectStatus=${ProjectStatus.ACCEPTED}`,
            },
            {
              title: "Rechazadas",
              url: `/applications?projectStatus=${ProjectStatus.REJECTED}`,
            },
          ],
        },
        {
          title: "Programas",
          url: "/programs",
          icon: BookOpen,
          items: [
            {
              title: "Todos los Programas",
              url: "/programs",
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
    }
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
        {
          /*
            <NavProjects items={projects} />
          */
        }
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
