import { useForm, router } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import { useState } from "react"
import AddGuestModal from './AddGuestModal'

export default function BookingCreate({ hotels, guests, currentHotelId }) {
  // Only one hotel, readonly field
  const hotel = hotels[0]

  // Unique booking number generator
  const generateBookingNumber = () => {
    const now = new Date()
    const year = now.getFullYear().toString().slice(-2)
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
    return `BK${year}${month}${day}${random}`
  }

  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  const { data, setData, post, processing, errors } = useForm({
    hotel_id: hotel ? hotel.id : currentHotelId,
    selected_guests: [],
    booking_number: generateBookingNumber(),
    check_in_date: getTodayDate(),
    check_out_date: getTomorrowDate(),
    total_guests: 1,
    status: 'pending',
    payment_status: 'pending',
    total_amount: '',
    discount: '',
    tax_amount: '',
    grand_total: '',
  })

  const [guestModalOpen, setGuestModalOpen] = useState(false)

  // Handlers for guests (NO useEffect loop!)
  const handleGuestSelect = guest => {
    // Ignore duplicates
    if (!data.selected_guests.some(g => g.id === guest.id)) {
      const updatedGuests = [...data.selected_guests, guest]
      setData('selected_guests', updatedGuests)
      setData('total_guests', updatedGuests.length)
    }
    setGuestModalOpen(false)
  }

  const removeGuest = guestId => {
    const updatedGuests = data.selected_guests.filter(g => g.id !== guestId)
    setData('selected_guests', updatedGuests)
    setData('total_guests', updatedGuests.length || 1)
  }

  const submit = e => {
    e.preventDefault()
    if (!data.selected_guests.length) return alert('Select at least one guest!')
    // Prepare guest_ids for backend
    const submitData = {
      ...data,
      guest_ids: data.selected_guests.map(g => g.id)
    }
    post('/bookings', {
      data: submitData,
      onSuccess: () => router.visit('/bookings')
    })
  }

  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: '/dashboard' },
      { title: 'Bookings', href: '/bookings' },
      { title: 'Add Booking', href: '/bookings/create' },
    ]}>
      <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Add Booking</h1>
        <form onSubmit={submit} className="space-y-4">
          {/* Hotel (readonly) */}
          <div>
            <label className="block text-xs mb-1">Hotel</label>
            <Input readOnly value={hotel ? hotel.name : ''} />
          </div>
          {/* Booking Number (readonly/unique) */}
          <div>
            <label className="block text-xs mb-1">Booking Number</label>
            <Input readOnly value={data.booking_number} />
            {errors.booking_number && <div className="text-red-500 text-xs">{errors.booking_number}</div>}
          </div>
          {/* Dates */}
          <div className="grid md:grid-cols-2 gap-4">
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
          {/* Guests - Using AddGuestModal in Dialog */}
          <div>
            <label className="block text-xs mb-1">Guests</label>
            <div className="flex gap-2 mb-2">
              <Dialog open={guestModalOpen} onOpenChange={setGuestModalOpen}>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline">
                    Add Guest ({data.selected_guests.length})
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <AddGuestModal
                    onSelect={handleGuestSelect}
                    onClose={() => setGuestModalOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
            {/* Selected Guests Display */}
            <div className="space-y-2 max-h-48 overflow-y-auto border rounded p-2">
              {data.selected_guests.length > 0 ? (
                data.selected_guests.map((guest, index) => (
                  <div key={guest.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <div>
                      <span className="font-medium">{guest.first_name} {guest.last_name}</span>
                      <span className="text-xs text-gray-600 ml-2">{guest.phone}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGuest(guest.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No guests selected</p>
              )}
            </div>
            {errors.guest_ids && <div className="text-red-500 text-xs">{errors.guest_ids}</div>}
          </div>
          {/* Total Guests (auto-calculated) */}
          <div>
            <label className="block text-xs mb-1">Total Guests</label>
            <Input type="number" min={1} value={data.total_guests} readOnly />
            {errors.total_guests && <div className="text-red-500 text-xs">{errors.total_guests}</div>}
          </div>
          {/* Status */}
          <div>
            <label className="block text-xs mb-1">Status</label>
            <select className="w-full rounded border px-3 py-2"
              value={data.status}
              onChange={e => setData('status', e.target.value)}>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked_in">Checked In</option>
              <option value="checked_out">Checked Out</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {errors.status && <div className="text-red-500 text-xs">{errors.status}</div>}
          </div>
          {/* Payment Status */}
          <div>
            <label className="block text-xs mb-1">Payment Status</label>
            <select className="w-full rounded border px-3 py-2"
              value={data.payment_status}
              onChange={e => setData('payment_status', e.target.value)}>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
            {errors.payment_status && <div className="text-red-500 text-xs">{errors.payment_status}</div>}
          </div>
          {/* Amounts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs mb-1">Total Amount</label>
              <Input type="number" min={0} value={data.total_amount} onChange={e => setData('total_amount', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs mb-1">Discount</label>
              <Input type="number" min={0} value={data.discount} onChange={e => setData('discount', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs mb-1">Tax Amount</label>
              <Input type="number" min={0} value={data.tax_amount} onChange={e => setData('tax_amount', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs mb-1">Grand Total</label>
              <Input type="number" min={0} value={data.grand_total} onChange={e => setData('grand_total', e.target.value)} />
            </div>
          </div>
          {/* Confirm/Cancel Buttons */}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" onClick={() => router.visit('/bookings')}>Cancel</Button>
            <Button type="submit" disabled={processing}>Create Booking</Button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
