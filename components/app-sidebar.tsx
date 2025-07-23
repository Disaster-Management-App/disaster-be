"use client"

import {
  AlertTriangle,
  BarChart3,
  Database,
  FileText,
  Home,
  MapPin,
  MessageCircle,
  Radio,
  Settings,
  Shield,
  Truck,
  Users,
  Zap,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Real-time Monitoring",
    url: "/monitoring",
    icon: MapPin,
  },
  {
    title: "Alerts & Warnings",
    url: "/alerts",
    icon: AlertTriangle,
  },
  {
    title: "Evacuation Management",
    url: "/evacuation",
    icon: Users,
  },
  {
    title: "Resource Management",
    url: "/resources",
    icon: Truck,
  },
  {
    title: "Communication Center",
    url: "/communication",
    icon: Radio,
  },
  {
    title: "AI Assistant",
    url: "/chat",
    icon: MessageCircle,
  },
  {
    title: "Analytics & Reports",
    url: "/analytics",
    icon: BarChart3,
  },
]

const systemItems = [
  {
    title: "Sensor Network",
    url: "/sensors",
    icon: Zap,
  },
  {
    title: "Data Management",
    url: "/data",
    icon: Database,
  },
  {
    title: "Emergency Protocols",
    url: "/protocols",
    icon: FileText,
  },
  {
    title: "System Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-red-600 text-white">
                  <Shield className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Disaster Management</span>
                  <span className="truncate text-xs">Command Center</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Emergency Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Users />
              <span>Emergency Team</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
