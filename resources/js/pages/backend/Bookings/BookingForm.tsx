import { useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DialogClose } from '@/components/ui/dialog'
import { useEffect } from 'react'

type Guest = { id: number, first_name: string, last_name: string }
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
  guests: Guest[]
  onClose: () => void
}

export default function BookingForm({ booking, hotels, guests, onClose }: BookingFormProps) {
  const isEdit = !!(booking && booking.id)

  const { data, setData, post, put, processing, errors, reset } = useForm<Booking>({
    hotel_id: booking?.hotel_id ?? hotels[0]?.id ?? '',
    guest_id: booking?.guest_id ?? guests[0]?.id ?? '',
    booking_number: booking?.booking_number ?? '',
    check_in_date: booking?.check_in_date ?? '',
    check_out_date: booking?.check_out_date ?? '',
    total_guests: booking?.total_guests ?? 1,
    status: booking?.status ?? 'pending',
  })

  useEffect(() => {
    // update form values when editing
    if (isEdit && booking) {
      setData({
        hotel_id: booking.hotel_id ?? hotels[0]?.id ?? '',
        guest_id: booking.guest_id ?? guests[0]?.id ?? '',
        booking_number: booking.booking_number ?? '',
        check_in_date: booking.check_in_date ?? '',
        check_out_date: booking.check_out_date ?? '',
        total_guests: booking.total_guests ?? 1,
        status: booking.status ?? 'pending',
      })
    }
  }, [booking])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEdit && booking && booking.id) {
      put(`/bookings/${booking.id}`, {
        onSuccess: () => { reset(); onClose(); }
      })
    } else {
      post('/bookings', {
        onSuccess: () => { reset(); onClose(); }
      })
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs mb-1">Hotel</label>
        <select
          className="w-full rounded border px-3 py-2"
          value={data.hotel_id}
          onChange={e => setData('hotel_id', Number(e.target.value))}
          required
        >
          {hotels.map(hotel =>
            <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
          )}
        </select>
        {errors.hotel_id && <div className="text-red-500 text-xs">{errors.hotel_id}</div>}
      </div>

      <div>
        <label className="block text-xs mb-1">Guest</label>
        <select
          className="w-full rounded border px-3 py-2"
          value={data.guest_id}
          onChange={e => setData('guest_id', Number(e.target.value))}
          required
        >
          {guests.map(guest =>
            <option key={guest.id} value={guest.id}>
              {guest.first_name} {guest.last_name}
            </option>
          )}
        </select>
        {errors.guest_id && <div className="text-red-500 text-xs">{errors.guest_id}</div>}
      </div>

      <div>
        <label className="block text-xs mb-1">Check-In Date</label>
        <Input
          type="date"
          value={data.check_in_date}
          onChange={e => setData('check_in_date', e.target.value)}
          required
        />
        {errors.check_in_date && <div className="text-red-500 text-xs">{errors.check_in_date}</div>}
      </div>

      <div>
        <label className="block text-xs mb-1">Check-Out Date</label>
        <Input
          type="date"
          value={data.check_out_date}
          onChange={e => setData('check_out_date', e.target.value)}
          required
        />
        {errors.check_out_date && <div className="text-red-500 text-xs">{errors.check_out_date}</div>}
      </div>

      <div>
        <label className="block text-xs mb-1">Guests</label>
        <Input
          type="number"
          min={1}
          value={data.total_guests}
          onChange={e => setData('total_guests', Number(e.target.value))}
          required
        />
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

      <div className="flex gap-x-2 mt-4 justify-end">
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
