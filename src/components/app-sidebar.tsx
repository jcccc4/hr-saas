import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  
  {
    title: "Calendar",
    url: "/leave",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },{
    title: "Inbox",
    url: "/",
    icon: Inbox,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar({
  side = "left",
  collapsible = "none",
}: {
  side?: "left" | "right" | undefined;
  collapsible?: "none" | "offcanvas" | "icon" | undefined;
}) {
  return (
    <Sidebar side={side} collapsible={collapsible}>
      <SidebarContent>
        <SidebarHeader className="w-full h-20 flex justify-start flex-row items-center">
          <div className="h-6 w-6 bg-primary rounded-full"></div>
          <h1>Application</h1>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
