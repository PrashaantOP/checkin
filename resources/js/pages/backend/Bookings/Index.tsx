import { Head, router } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Pencil, Trash } from 'lucide-react'
import { useState } from 'react'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import GuestDetails from './guestDetails' // Adjust the import path as needed

type Guest = { id: number, first_name: string, last_name: string, phone?: string, [key: string]: any }
type Booking = {
  id: number
  booking_number: string
  hotel_id?: number
  guests: Guest[] // now guests is an array
  hotel: { name: string }
  check_in_date: string
  check_out_date: string
  total_guests: number
  status: string
  created_at: string
}
type Hotel = { id: number, name: string }
interface BookingsPageProps {
  bookings: { data: Booking[], links?: any[] }
  hotels: Hotel[]
  guests: Guest[]
}
const breadcrumbs = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Bookings', href: '/bookings' }
]
export default function BookingsIndex({ bookings, hotels, guests }: BookingsPageProps) {
  const [pageLoading, setPageLoading] = useState(false)
  const [openGuest, setOpenGuest] = useState<Guest | null>(null)
  const handleEdit = (booking: Booking) => {
    router.visit(`/bookings/${booking.id}/edit`)
  }
  const handleDelete = (booking: Booking) => {
    if (window.confirm('Delete booking?')) {
      router.delete(`/bookings/${booking.id}`, {
        onStart: () => setPageLoading(true),
        onFinish: () => setPageLoading(false)
      })
    }
  }
  const hasBookings = bookings.data && bookings.data.length > 0
  const handlePaginationClick = (link: any) => {
    if (link.url) {
      setPageLoading(true)
      router.visit(link.url, {
        onFinish: () => setPageLoading(false)
      })
    }
  }
  const handleCreate = () => {
    router.visit('/bookings/create')
  }
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Bookings" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border p-4 bg-white dark:bg-neutral-900">
          <div className="flex justify-between mb-4">
            <h1 className="text-xl font-bold">Bookings</h1>
            <Button onClick={handleCreate}>Create Booking</Button>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden dark:border-neutral-700 bg-white dark:bg-neutral-900">
            {pageLoading ? (
              <div className="flex justify-center py-20">
                <span className="text-xl text-gray-600 dark:text-neutral-400 font-semibold">
                  Loading...
                </span>
              </div>
            ) : hasBookings ? (
              <>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                  <thead className="bg-gray-50 dark:bg-neutral-700">
                    <tr>
                      <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">ID</th>
                      <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Guest Names</th>
                      <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden md:table-cell">
                        <div className="flex flex-col"><p>Check-In</p><p className='block 2xl:hidden'>Check-Out</p></div>
                      </th>
                      <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden 2xl:table-cell">Check-Out</th>
                      <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden lg:table-cell">Status</th>
                      <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden lg:table-cell">Created</th>
                      <th className="px-4 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                    {bookings.data.map(booking => (
                      <tr key={booking.id}>
                        <td className="px-4 py-4 text-sm font-medium text-gray-800 dark:text-neutral-200">
                          #{booking.id}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200 flex flex-col justify-start gap-1">
                        {booking.guests?.map(guest => (
                            <Dialog
                            key={guest.id}
                            open={openGuest?.id === guest.id}
                            onOpenChange={open => setOpenGuest(open ? guest : null)}
                            >
                            <DialogTrigger asChild>
                                <button
                                className="text-gray-600 font-bold underline cursor-pointer bg-transparent border-none p-0 text-start"
                                type="button"
                                >
                                {guest.first_name} {guest.last_name}
                                </button>
                            </DialogTrigger>
                            <DialogContent>
                                <GuestDetails guest={guest} />
                            </DialogContent>
                            </Dialog>
                        ))}
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200 hidden md:table-cell">
                          <div className="flex flex-col">
                            <p className='text-md font-bold'>{booking.check_in_date}</p>
                            <p className='text-md font-bold block 2xl:hidden'>{booking.check_out_date}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200 hidden 2xl:table-cell">
                          <p className='font-bold'>{booking.check_out_date}</p>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200 hidden lg:table-cell">
                          {booking.status}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200 hidden lg:table-cell">
                          {new Date(booking.created_at).toLocaleString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </td>
                        <td className="px-4 py-4 text-end text-sm font-medium">
                          <div className="flex gap-x-3 justify-end">
                            <button
                              onClick={() => handleEdit(booking)}
                              className="text-gray-600 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-400"
                              aria-haspopup="dialog"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(booking)}
                              className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {bookings.links && bookings.links.length > 3 && (
                  <div className="flex justify-start px-4 items-center gap-2 my-6">
                    {bookings.links.map((link, i) => (
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
                <svg className="h-20 w-20 opacity-75" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#F9FAFB" /><path d="M8 12h.01M12 16h.01M16 12h.01M12 8h.01" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" /></svg>
                <p className="text-xl text-gray-600 dark:text-neutral-400 font-semibold">
                  No bookings available for this hotel yet.
                </p>
                <Button onClick={handleCreate}>Add First Booking</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
