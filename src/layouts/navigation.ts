import type { LucideIcon } from 'lucide-react'

export interface NavigationItem {
  label: string
  to: string
  icon?: LucideIcon
  end?: boolean
}

export interface NavigationGroup {
  label: string
  icon: LucideIcon
  items: NavigationItem[]
}

export type SidebarItem = NavigationItem | NavigationGroup
