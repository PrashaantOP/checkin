import { Head, router } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import { Pencil, Trash } from 'lucide-react'
import { useState } from 'react'
import BookingForm from './BookingForm'
import { DialogTitle } from '@radix-ui/react-dialog'

type Booking = {
  id: number
  booking_number: string
  hotel_id?: number
  guest_id?: number
  guest: { first_name: string, last_name: string, phone: string }
  hotel: { name: string }
  check_in_date: string
  check_out_date: string
  total_guests: number
  status: string
  created_at: string
}

type Hotel = { id: number, name: string }
type Guest = { id: number, first_name: string, last_name: string }

interface BookingsPageProps {
  bookings: { data: Booking[] }
  hotels: Hotel[]
  guests: Guest[]
}

const breadcrumbs = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Bookings', href: '/bookings' }
]

export default function BookingsIndex({ bookings, hotels, guests }: BookingsPageProps) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Booking | null>(null)

  const handleEdit = (booking: Booking) => {
    setEditing(booking)
    setOpen(true)
  }

  const handleDelete = (booking: Booking) => {
    if (window.confirm('Delete booking?')) {
      router.delete(`/bookings/${booking.id}`)
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Bookings" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border p-4 bg-white dark:bg-neutral-900">
          <div className="flex justify-between mb-4">
            <h1 className="text-xl font-bold">Bookings</h1>
            <Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button onClick={() => { setEditing(null); setOpen(true) }}>Add Booking</Button>
  </DialogTrigger>
  <DialogContent>
    {/* This fixes the error */}
    <DialogTitle className="text-lg font-bold mb-4">
      {editing ? 'Edit Booking' : 'Add Booking'}
    </DialogTitle>
    <BookingForm
      booking={editing}
      hotels={hotels}
      guests={guests}
      onClose={() => setOpen(false)}
    />
  </DialogContent>
</Dialog>
          </div>
          <div className="overflow-x-auto rounded">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
              <thead className="bg-gray-50 dark:bg-neutral-700">
                <tr>
                  <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Booking No</th>
                  <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Guest Name</th>
                  <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Hotel</th>
                  <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Mobile</th>
                  <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden md:table-cell">Check-In</th>
                  <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden md:table-cell">Check-Out</th>
                  <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden lg:table-cell">Status</th>
                  <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden md:table-cell">Guests</th>
                  <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden md:table-cell">Created</th>
                  <th className="px-4 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {bookings.data.map(booking => (
                  <tr key={booking.id}>
                    <td className="px-4 py-4 text-sm font-medium text-gray-800 dark:text-neutral-200">
                      {booking.booking_number}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200">
                      {booking.guest?.first_name} {booking.guest?.last_name}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200">
                      {booking.hotel?.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200">
                      {booking.guest?.phone}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200 hidden md:table-cell">
                      {booking.check_in_date}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200 hidden md:table-cell">
                      {booking.check_out_date}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200 hidden lg:table-cell">
                      {booking.status}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200 hidden md:table-cell">
                      {booking.total_guests}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200 hidden md:table-cell">
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
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
