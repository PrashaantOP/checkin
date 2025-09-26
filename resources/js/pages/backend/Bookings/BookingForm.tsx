import { useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DialogClose, Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import { useEffect, useState } from 'react'
import AddGuestModal from './AddGuestModal'

type Hotel = { id: number, name: string }
type Booking = {
  id?: number
  booking_number?: string
  hotel_id?: number
  guest_id?: number
  check_in_date?: string
  check_out_date?: string
  total_guests?: number
  status?: string
}

interface BookingFormProps {
  booking?: Booking | null
  hotels: Hotel[]
  onClose: () => void
}

export default function BookingForm({ booking, hotels, onClose }: BookingFormProps) {
  const isEdit = !!(booking && booking.id)
  const currentHotelId = hotels.length ? hotels[0].id : ''
  const currentHotelName = hotels.length ? hotels[0].name : ''
  const [openGuestModal, setOpenGuestModal] = useState(false)
  const [selectedGuest, setSelectedGuest] = useState<{ id: number, first_name: string, last_name: string, phone: string } | null>(null)

  const { data, setData, post, put, processing, errors, reset } = useForm<Booking>({
    hotel_id: booking?.hotel_id ?? currentHotelId ?? '',
    guest_id: booking?.guest_id ?? '',
    booking_number: booking?.booking_number ?? '',
    check_in_date: booking?.check_in_date ?? '',
    check_out_date: booking?.check_out_date ?? '',
    total_guests: booking?.total_guests ?? 1,
    status: booking?.status ?? 'pending',
  })

  useEffect(() => {
    if (isEdit && booking) {
      setData({
        hotel_id: booking.hotel_id ?? currentHotelId ?? '',
        guest_id: booking.guest_id ?? '',
        booking_number: booking.booking_number ?? '',
        check_in_date: booking.check_in_date ?? '',
        check_out_date: booking.check_out_date ?? '',
        total_guests: booking.total_guests ?? 1,
        status: booking.status ?? 'pending',
      })
    }
  }, [booking])

  // After guest add/select in modal, update guest_id in booking form
  const handleGuestSelected = (guest) => {
    setSelectedGuest(guest)
    setData('guest_id', guest.id)
    setOpenGuestModal(false)
    console.log('Guest selected ID:', guest?.id)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!data.guest_id) return alert('Please select/add guest first!')
    if (isEdit && booking?.id) {
      put(`/bookings/${booking.id}`, { onSuccess: () => { reset(); onClose(); } })
    } else {
      post('/bookings', { onSuccess: () => { reset(); onClose(); } })
    }
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4"
      style={{ maxWidth: '680px', width: '100%' }} // Wider modal
    >
      <div>
        <label className="block text-xs mb-1">Hotel (Current)</label>
        <select className="w-full rounded border px-3 py-2 bg-gray-100 cursor-not-allowed"
          value={data.hotel_id} disabled>
          <option value={currentHotelId}>{currentHotelName}</option>
        </select>
        <input type="hidden" name="hotel_id" value={data.hotel_id} />
        {errors.hotel_id && <div className="text-red-500 text-xs">{errors.hotel_id}</div>}
      </div>

      <div>
        <label className="block text-xs mb-2">Guest</label>
        {/* If guest already selected, show info */}
        {selectedGuest ? (
          <div className="rounded border px-4 py-3 mb-2 bg-gray-50 flex flex-col gap-1">
            <span className="text-sm font-semibold">{selectedGuest.first_name} {selectedGuest.last_name}</span>
            <span className="text-xs text-gray-600">{selectedGuest.phone}</span>
            <Button type="button" size="xs" variant="outline" onClick={() => setOpenGuestModal(true)}>
              Change Guest
            </Button>
          </div>
        ) : (
          <Button type="button" size="sm" variant="outline" onClick={() => setOpenGuestModal(true)}>
            Add Guest
          </Button>
        )}
        {errors.guest_id && <div className="text-red-500 text-xs">{errors.guest_id}</div>}
      </div>

      <Dialog open={openGuestModal} onOpenChange={setOpenGuestModal}>
        <DialogContent className="max-w-lg w-full p-0">
          <AddGuestModal onSelect={handleGuestSelected} onClose={() => setOpenGuestModal(false)} />
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs mb-1">Check-In Date</label>
          <Input type="date" value={data.check_in_date} onChange={e => setData('check_in_date', e.target.value)} required />
          {errors.check_in_date && <div className="text-red-500 text-xs">{errors.check_in_date}</div>}
        </div>
        <div>
          <label className="block text-xs mb-1">Check-Out Date</label>
          <Input type="date" value={data.check_out_date} onChange={e => setData('check_out_date', e.target.value)} required />
          {errors.check_out_date && <div className="text-red-500 text-xs">{errors.check_out_date}</div>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs mb-1">Guests</label>
          <Input type="number" min={1} value={data.total_guests} onChange={e => setData('total_guests', Number(e.target.value))} required />
          {errors.total_guests && <div className="text-red-500 text-xs">{errors.total_guests}</div>}
        </div>
        <div>
          <label className="block text-xs mb-1">Status</label>
          <select
            className="w-full rounded border px-3 py-2"
            value={data.status}
            onChange={e => setData('status', e.target.value)}
            required
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In</option>
            <option value="checked_out">Checked Out</option>
            <option value="cancelled">Cancelled</option>
          </select>
          {errors.status && <div className="text-red-500 text-xs">{errors.status}</div>}
        </div>
      </div>

      <div className="flex gap-x-2 mt-6 justify-end">
        <DialogClose asChild>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={processing}>
          {isEdit ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  )
}
