"use client"

import * as React from "react"
import { AudioWaveform, Check, ChevronsUpDown, Plus } from "lucide-react"
import { router, usePage } from '@inertiajs/react'
import toast from 'react-hot-toast';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function TeamSwitcher() {
  const { isMobile } = useSidebar()
  const { auth } = usePage().props as any

  const teams = auth.hotels.map((hotel: any) => ({
    name: hotel.name,
    logo: AudioWaveform,
    address: hotel.address,
    plan: hotel.id === auth.current_hotel_id ? 'Current' : 'Available',
    id: hotel.id,
  }))

  const [activeTeam, setActiveTeam] = React.useState(() =>
    teams.find((team: any) => team.id === auth.current_hotel_id) || teams[0]
  )

  if (!activeTeam) return null

  const switchhotel = (hotel_id: number, hotel_name: string) => {
  toast.promise(
    new Promise((resolve, reject) => {
      router.visit('/hotel/switch', {
        method: 'post',
        data: { hotel_id },
        preserveScroll: true,
        // only: ['auth'],
        onStart: () => {
          localStorage.removeItem('activeBillId');
          localStorage.removeItem('billCounter');
          localStorage.removeItem('bills');
        },
        onSuccess: () => {
          resolve(`Switched to ${hotel_name}!`);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        onError: () => reject('Failed to switch hotel.'),
      });
    }),
    {
      loading: 'Switching...',
      success: (message) => message,
      error: (err) => err || 'Something went wrong!',
    }
  );
};
const { current_role } = usePage().props;
// console.log(auth);
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-red-600">{activeTeam.name}</span>
                <span className="truncate text-xs">{activeTeam.address}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              hotels
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.id}
                onClick={() => {
                  setActiveTeam(team);
                  switchhotel(team.id, team.name);
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border ">
                  {team.id === auth.current_hotel_id && (
                    <Check className="text-green-500 size-4" />
                  )}
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                
              </DropdownMenuItem>
              
            ))}
            {current_role == 'admin' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add hotel</div>
            </DropdownMenuItem>
            </>
        )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
