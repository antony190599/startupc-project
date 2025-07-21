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

import Image from 'next/image';
import StartupcLogo from "@/public/startupc.svg"

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

// Use a React component for the logo (inline SVG)
const StartupcLogoComponent = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M0 2.78773L1.69202 0L4.85271 5.57545L1.69202 11.1509L0 8.25993L1.69202 5.57545L0 2.78773Z" fill="white"/>
    <path d="M6.19495 2.78773L7.88697 0L11.0477 5.57545L7.88697 11.1509L6.19495 8.25993L7.88697 5.57545L6.19495 2.78773Z" fill="white"/>
    <path d="M16 2.78773L14.348 0L11.0477 5.57545L14.348 11.3574L16 8.15668L14.348 5.57545L16 2.78773Z" fill="white"/>
  </svg>
);

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
          title: "Mis Equipos",
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
      logo: StartupcLogoComponent,
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
