"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

interface NavMainProps {
  items: NavItem[]
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Build the complete current URL with query parameters
  const currentUrl = searchParams.toString() 
    ? `${pathname}?${searchParams.toString()}`
    : pathname

  /**
   * Compares two URLs including query parameters
   * @param url1 - First URL to compare
   * @param url2 - Second URL to compare
   * @returns true if URLs match exactly (path + query parameters)
   */
  const urlsMatch = (url1: string, url2: string): boolean => {
    try {
      const [path1, query1] = url1.split('?')
      const [path2, query2] = url2.split('?')
      
      // Check if paths match
      if (path1 !== path2) {
        return false
      }
      
      // If both have query parameters, check if they match
      if (query1 && query2) {
        const params1 = new URLSearchParams(query1)
        const params2 = new URLSearchParams(query2)
        
        // Check if all parameters in query1 exist in query2 with same values
        for (const [key, value] of params1.entries()) {
          if (params2.get(key) !== value) {
            return false
          }
        }
        
        // Check if all parameters in query2 exist in query1 with same values
        for (const [key, value] of params2.entries()) {
          if (params1.get(key) !== value) {
            return false
          }
        }
        
        return true
      }
      
      // If only one has query parameters, they don't match
      if (query1 || query2) {
        return false
      }
      
      // Both have no query parameters and paths match
      return true
    } catch (error) {
      // Fallback to simple string comparison if URL parsing fails
      return url1 === url2
    }
  }

  /**
   * Determines if a parent navigation item should be open
   * @param item - The parent navigation item
   * @returns true if the parent should be open
   */
  const isParentActive = (item: NavItem): boolean => {
    // Check if current URL matches the parent URL
    if (urlsMatch(currentUrl, item.url)) {
      return true
    }

    // Check if current URL matches any child URL
    if (item.items) {
      return item.items.some((subItem) => urlsMatch(currentUrl, subItem.url))
    }

    return false
  }

  /**
   * Determines if a child navigation item is active
   * @param childUrl - The child item's URL
   * @returns true if the child item is active
   */
  const isChildActive = (childUrl: string): boolean => {
    return urlsMatch(currentUrl, childUrl)
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = isParentActive(item)
          
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const isSubItemActive = isChildActive(subItem.url)
                      
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton 
                            asChild
                            isActive={isSubItemActive}
                          >
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
