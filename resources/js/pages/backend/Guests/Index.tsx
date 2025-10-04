import { Head, router } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import GuestDetails from './GuestDetails'
import GuestFormModal from './GuestFormModal'

type Guest = {
  id: number
  first_name: string
  last_name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  country?: string
  id_proof_type?: string
  id_proof_number?: string
  is_profile_completed?: boolean
}

interface GuestIndexProps {
  guests: {
    data: Guest[]
    links?: any[]
  }
}

const breadcrumbs = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Guests', href: '/guests' }
]

export default function GuestsIndex({ guests }: GuestIndexProps) {
  const [pageLoading, setPageLoading] = useState(false)
  const [openGuest, setOpenGuest] = useState<Guest | null>(null)

  const handleSaveGuest = (guestData: Guest) => {
    if (guestData.id) {
      // Edit existing guest
      router.put(`/guests/${guestData.id}`, guestData, {
        onStart: () => setPageLoading(true),
        onFinish: () => setPageLoading(false)
      })
    } else {
      // Create new guest
      router.post('/guests', guestData, {
        onStart: () => setPageLoading(true),
        onFinish: () => setPageLoading(false)
      })
    }
  }

  const handlePaginationClick = (link: any) => {
    if (link.url) {
      setPageLoading(true)
      router.visit(link.url, {
        onFinish: () => setPageLoading(false)
      })
    }
  }

  const hasGuests = guests.data && guests.data.length > 0

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Guests" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border p-4 bg-white dark:bg-neutral-900">
          <div className="flex justify-between mb-4">
            <h1 className="text-xl font-bold">Guests</h1>
            <GuestFormModal onSave={handleSaveGuest} buttonText="Add Guest" />
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden dark:border-neutral-700 bg-white dark:bg-neutral-900">
            {pageLoading ? (
              <div className="flex justify-center py-20">
                <span className="text-xl text-gray-600 dark:text-neutral-400 font-semibold">
                  Loading...
                </span>
              </div>
            ) : hasGuests ? (
              <>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                  <thead className="bg-gray-50 dark:bg-neutral-700">
                    <tr>
                      <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">ID</th>
                      <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Name</th>
                      <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden md:table-cell">Email</th>
                      <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden md:table-cell">Phone</th>
                      <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden lg:table-cell">City</th>
                      <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden lg:table-cell">Country</th>
                      <th className="px-4 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                    {guests.data.map(guest => (
                      <tr key={guest.id}>
                        <td className="px-4 py-4 text-sm font-medium text-gray-800 dark:text-neutral-200">
                          #{guest.id}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200">
                          <Dialog open={openGuest?.id === guest.id} onOpenChange={open => setOpenGuest(open ? guest : null)}>
                            <DialogTrigger asChild>
                              <button
                                className="text-gray-600 font-bold underline cursor-pointer bg-transparent border-none p-0"
                                type="button"
                              >
                                {guest.first_name} {guest.last_name}
                              </button>
                            </DialogTrigger>
                            <DialogContent className="p-0">
                              <GuestDetails guest={guest} />
                            </DialogContent>
                          </Dialog>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200 hidden md:table-cell">
                          {guest.email}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200 hidden md:table-cell">
                          {guest.phone}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200 hidden lg:table-cell">
                          {guest.city}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200 hidden lg:table-cell">
                          {guest.country}
                        </td>
                        <td className="px-4 py-4 text-end text-sm font-medium">
                          <div className="flex gap-x-3 justify-end">
                            <GuestFormModal
                              guest={guest}
                              onSave={handleSaveGuest}
                              buttonText={<Pencil className="w-4 h-4" />}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {guests.links && guests.links.length > 3 && (
                  <div className="flex justify-start px-4 items-center gap-2 my-6">
                    {guests.links.map((link, i) => (
                      <button
                        key={i}
                        disabled={!link.url}
                        onClick={() => handlePaginationClick(link)}
                        className={`px-3 py-1 rounded text-sm border ${link.active ? 'bg-red-600 text-white border-red-600' : 'text-red-600 border-red-200 hover:bg-red-50'} disabled:opacity-50`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center py-20 gap-4">
                <svg className="h-20 w-20 opacity-75" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#F9FAFB" />
                  <path d="M8 12h.01M12 16h.01M16 12h.01M12 8h.01" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <p className="text-xl text-gray-600 dark:text-neutral-400 font-semibold">
                  No guests available for this hotel yet.
                </p>
                <GuestFormModal onSave={handleSaveGuest} buttonText="Add First Guest" />
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
