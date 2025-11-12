import { ReactNode } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/ui/theme_toggle"
import { LogoutButton } from "@/components/ui/logout_button"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-12 items-center gap-2 rounded-md border bg-neutral-100/60 px-2 text-neutral-900 dark:bg-neutral-800/40 dark:text-neutral-100">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mx-2 h-6" />
          <span className="text-sm font-medium">Dashboard</span>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
