"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  GalleryVerticalEnd,
  User as UserIcon,
  Key,
  Home,
  Layout,
  FolderKanban,
  Briefcase,
  Building,
  Award,
  Share2,
  FileText,
  BookOpen,
  Tags,
  Code2,
} from "lucide-react"

import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

// Dados de UI auxiliares
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: GalleryVerticalEnd,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: GalleryVerticalEnd,
      plan: "Free",
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const isActive = (href: string, exact = false) => {
    if (exact) {
      // Match apenas a rota exata (considerando possível barra final)
      return pathname === href || pathname === `${href}`.replace(/\/$/, "") + "/"
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }
  const { data: session } = useSession()
  const role = (session?.user as any)?.role as "ADMIN" | "USER" | undefined
  const userProps = {
    name: session?.user?.name ?? "Usuário",
    email: session?.user?.email ?? "—",
    avatar: (session?.user as any)?.avatar_url ?? "",
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {/* Admin ou Perfil (condicional por role) */}
        {role === "ADMIN" ? (
          <SidebarGroup>
            <SidebarGroupLabel className="font-semibold">Admin</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/admin/users")} className="font-medium">
                  <a href="/dashboard/admin/users">
                    <UserIcon />
                    <span>Usuários</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        ) : (
          <SidebarGroup>
            <SidebarGroupLabel className="font-semibold">Perfil</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/settings/profile")} className="font-medium">
                  <a href="/dashboard/settings/profile">
                    <UserIcon />
                    <span>Meu Perfil</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
        {/* Portifolio */}
        <SidebarGroup>
          <SidebarGroupLabel className="font-semibold">Portifolio</SidebarGroupLabel>
          <SidebarMenu>
              <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard", true)} className="font-medium">
                <a href="/dashboard">
                  <Home />
                  <span>Visão Geral</span>
                </a>
              </SidebarMenuButton>
              </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/portifolio")} className="font-medium">
                <a href="/dashboard/portifolio">
                  <Layout />
                  <span>Portifolio</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              {/* Removido: entradas Hero e About do AppSidebar */}
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/portfolio/projects")} className="font-medium">
                <a href="/dashboard/portfolio/projects">
                  <FolderKanban />
                  <span>Projetos</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/portfolio/experiences")} className="font-medium">
                <a href="/dashboard/portfolio/experiences">
                  <Briefcase />
                  <span>Experiências</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/portfolio/companies")} className="font-medium">
                <a href="/dashboard/portfolio/companies">
                  <Building />
                  <span>Empresas</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/portfolio/certificates")} className="font-medium">
                <a href="/dashboard/portfolio/certificates">
                  <Award />
                  <span>Certificados</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/portfolio/socials")} className="font-medium">
                <a href="/dashboard/portfolio/socials">
                  <Share2 />
                  <span>Social Links</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/portfolio/pages")} className="font-medium">
                <a href="/dashboard/portfolio/pages">
                  <FileText />
                  <span>Páginas</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Blog */}
        <SidebarGroup>
          <SidebarGroupLabel className="font-semibold">Blog</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/blog/posts")} className="font-medium">
                <a href="/dashboard/blog/posts">
                  <BookOpen />
                  <span>Posts</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/blog/categories")} className="font-medium">
                <a href="/dashboard/blog/categories">
                  <Tags />
                  <span>Categorias</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Tecnologias */}
        <SidebarGroup>
          <SidebarGroupLabel className="font-semibold">Tecnologias</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/technologies")} className="font-medium">
                <a href="/dashboard/technologies">
                  <Code2 />
                  <span>Tecnologias</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Configurações */}
        <SidebarGroup>
          <SidebarGroupLabel className="font-semibold">Configurações</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/settings/profile")} className="font-medium">
                <a href="/dashboard/settings/profile">
                  <UserIcon />
                  <span>Perfil</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/settings/api-keys")} className="font-medium">
                <a href="/dashboard/settings/api-keys">
                  <Key />
                  <span>API Keys</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userProps} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
