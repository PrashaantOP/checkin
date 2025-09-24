// import { NavFooter } from '@/components/nav-footer'
import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { type NavItem } from '@/types'
import { Link } from '@inertiajs/react'
import {
  LayoutGrid,
  Building2,
  BedDouble,
  Users,
  CalendarCheck2,
  CreditCard,
  FileText,
  Briefcase,
  BarChart3,
  UserCog,
} from 'lucide-react'
import AppLogo from './app-logo'
import { TeamSwitcher } from './team-switcher'

const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutGrid,
  },
  {
    title: 'Bookings',
    href: '/bookings',
    icon: CalendarCheck2,
  },
  {
    title: 'Guests',
    href: '/guests',
    icon: Users,
  },
  
  {
    title: 'Rooms',
    href: '/rooms',
    icon: BedDouble,
  },
  
  {
    title: 'Staff',
    href: '/staff',
    icon: Briefcase,
  },
  
  {
    title: 'Payments',
    href: '/payments',
    icon: CreditCard,
  },
  {
    title: 'Invoices',
    href: '/invoices',
    icon: FileText,
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: BarChart3,
  },
  {
    title: 'Hotels',
    href: '/hotels',
    icon: Building2,
  },
  {
    title: 'User Management',
    href: '/users',
    icon: UserCog,
  },
]

// const footerNavItems: NavItem[] = [
//   {
//     title: 'Repository',
//     href: 'https://github.com/laravel/react-starter-kit',
//     icon: Folder,
//   },
//   {
//     title: 'Documentation',
//     href: 'https://laravel.com/docs/starter-kits#react',
//     icon: BookOpen,
//   },
// ]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        {/* <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu> */}
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainNavItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
