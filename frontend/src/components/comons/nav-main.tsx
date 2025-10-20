import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { NavLink, useLocation } from "react-router-dom";

interface Item {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: Item[];
}

export function NavMain({
  items,
  dashboard,
}: {
  items: Item[];
  dashboard: Item[];
}) {
  const location = useLocation();
  const { pathname, search } = location;

  const isUrlActive = (url: string): boolean => {
    const [path, query] = url.split("?");
    if (pathname !== path) return false;
    if (!query) return true;
    // simple contains check for query string like "tab=conflicts"
    return search.includes(query);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Tổng quan</SidebarGroupLabel>
      <SidebarMenu>
        {dashboard.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton tooltip={item.title} isActive={isUrlActive(item.url)} asChild>
              <NavLink to={item.url}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarGroupLabel>Chức năng</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={
              item.isActive ||
              isUrlActive(item.url) ||
              (item.items ?? []).some((s) => isUrlActive(s.url))
            }
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={isUrlActive(item.url) || (item.items ?? []).some((s) => isUrlActive(s.url))}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild isActive={isUrlActive(subItem.url)}>
                        <NavLink to={subItem.url}>
                          <span>{subItem.title}</span>
                        </NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
