import { useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useRef } from 'react'
import axios from 'axios'

const idProofTypes = [
  { value: '', label: 'Select ID Proof' },
  { value: 'Aadhar', label: 'Aadhar Card' },
  { value: 'Voter', label: 'Voter ID' },
  { value: 'PAN', label: 'PAN Card' }
]

function Switch({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${checked ? 'bg-green-600' : 'bg-gray-300'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${checked ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  )
}

export default function AddGuestModal({ onSelect, onClose }) {
  const [matchedGuests, setMatchedGuests] = useState([])
  const [searching, setSearching] = useState(false)
  const [showForm, setShowForm] = useState(true)
  const [showIdProof, setShowIdProof] = useState(false)
  const inputRef = useRef(null)

  const { data, setData, post, processing, errors, reset } = useForm({
    mobile: '',
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    country: '',
    id_proof_type: '',
    id_proof_number: '',
  })

  // Mobile input change, fetch guests
  async function onMobileChange(e) {
    const value = e.target.value
    setData('mobile', value)
    setData('phone', value)
    if (value.length >= 4) {
      setSearching(true)
      try {
        const res = await axios.get(`/guests/search?mobile=${value}`)
        if (res.data?.guests && Array.isArray(res.data.guests) && res.data.guests.length) {
          setMatchedGuests(res.data.guests)
          setShowForm(true)
        } else {
          setMatchedGuests([])
          setShowForm(true)
        }
      } catch {
        setMatchedGuests([])
        setShowForm(true)
      }
      setSearching(false)
    } else {
      setMatchedGuests([])
      setShowForm(true)
    }
  }

  // Just fill form on select, do NOT call onSelect here
  const handleSelectGuest = guest => {
    setData('first_name', guest.first_name)
    setData('last_name', guest.last_name)
    setData('phone', guest.phone)
    setData('email', guest.email || '')
    setData('address', guest.address || '')
    setData('city', guest.city || '')
    setData('country', guest.country || '')
    setData('id_proof_type', guest.id_proof_type || '')
    setData('id_proof_number', guest.id_proof_number || '')
    setData('mobile', guest.phone)
    setShowIdProof(!!(guest.id_proof_type || guest.id_proof_number))
    setMatchedGuests([]) // Hide guests list after selection
    setShowForm(true)
  }

  const submit = async e => {
    e.preventDefault()
    setData('phone', data.mobile)
    if (!showIdProof) {
      setData('id_proof_type', '')
      setData('id_proof_number', '')
    }
    try {
      // Always submit the form whether editing existing or adding new
      const res = await axios.post('/guests', {
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        email: data.email,
        address: data.address,
        city: data.city,
        country: data.country,
        id_proof_type: showIdProof ? data.id_proof_type : '',
        id_proof_number: showIdProof ? data.id_proof_number : ''
      })
      if (res.data && res.data.guest) {
        onSelect(res.data.guest)
        reset()
        onClose()
      }
    } catch (err) { console.log(err) }
  }

  const handleSwitch = (on) => {
    setShowIdProof(on)
    if (!on) {
      setData('id_proof_type', '')
      setData('id_proof_number', '')
    }
  }

  return (
    <div className="p-6 space-y-4 relative">
      <h2 className="text-lg font-bold mb-2">Add Guest</h2>
      <form onSubmit={e => {
    e.preventDefault();
    e.stopPropagation(); // <- yeh line sab kuch safe rakh degi!!
    submit(e);
  }} className="space-y-4">
        <div className="relative">
          <label className="block text-xs">Phone/Mobile<span className="text-red-500">*</span></label>
          <Input
            ref={inputRef}
            type="text"
            value={data.mobile}
            onChange={onMobileChange}
            maxLength={15}
            minLength={4}
            required
          />
          {matchedGuests.length > 0 && (
            <div className="absolute left-0 top-14 z-50 w-full bg-white shadow-lg border rounded-lg max-h-48 overflow-y-auto" style={{ minWidth: '260px' }}>
              <div className="text-xs px-3 py-2 text-gray-700 font-semibold sticky top-0 bg-white z-10">Select Guest:</div>
              {matchedGuests.map(guest => (
                <div key={guest.id} className="flex flex-col md:flex-row md:items-center md:justify-between px-3 py-2 border-b border-gray-100 hover:bg-green-50 last:border-b-0 cursor-pointer"
                  onClick={() => handleSelectGuest(guest)}>
                  <div>
                    <div className="font-semibold text-green-900">{guest.first_name} {guest.last_name}</div>
                    <div className="text-xs text-green-800">{guest.phone}</div>
                    {guest.email && <div className="text-xs text-gray-600">{guest.email}</div>}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2 md:mt-0 md:ml-4"
                    tabIndex={-1}
                    onClick={e => { e.stopPropagation(); handleSelectGuest(guest); }}
                  >
                    Select
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {showForm && (
          <>
            <div>
              <label className="block text-xs">First Name<span className="text-red-500">*</span></label>
              <Input value={data.first_name} onChange={e => setData('first_name', e.target.value)} required />
              {errors.first_name && <div className="text-red-500 text-xs">{errors.first_name}</div>}
            </div>
            <div>
              <label className="block text-xs">Last Name</label>
              <Input value={data.last_name} onChange={e => setData('last_name', e.target.value)} />
              {errors.last_name && <div className="text-red-500 text-xs">{errors.last_name}</div>}
            </div>
            <div>
              <label className="block text-xs">Email</label>
              <Input value={data.email} onChange={e => setData('email', e.target.value)} />
              {errors.email && <div className="text-red-500 text-xs">{errors.email}</div>}
            </div>
            <div>
              <label className="block text-xs">Address</label>
              <Input value={data.address} onChange={e => setData('address', e.target.value)} />
              {errors.address && <div className="text-red-500 text-xs">{errors.address}</div>}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-xs">City</label>
                <Input value={data.city} onChange={e => setData('city', e.target.value)} />
                {errors.city && <div className="text-red-500 text-xs">{errors.city}</div>}
              </div>
              <div>
                <label className="block text-xs">Country</label>
                <Input value={data.country} onChange={e => setData('country', e.target.value)} />
                {errors.country && <div className="text-red-500 text-xs">{errors.country}</div>}
              </div>
            </div>
            {/* ID Proof Switch */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-medium">Add ID Proof?</span>
                <Switch checked={showIdProof} onChange={handleSwitch} />
                <span className="text-xs text-gray-500">{showIdProof ? 'Yes' : 'No'}</span>
              </div>
              {showIdProof && (
                <div className="grid gap-3 md:grid-cols-2 mt-2">
                  <div>
                    <label className="block text-xs">ID Proof Type</label>
                    <select value={data.id_proof_type} onChange={e => setData('id_proof_type', e.target.value)}
                      className="w-full rounded border px-3 py-2">
                      {idProofTypes.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    {errors.id_proof_type && <div className="text-red-500 text-xs">{errors.id_proof_type}</div>}
                  </div>
                  <div>
                    <label className="block text-xs">ID Proof Number</label>
                    <Input value={data.id_proof_number} onChange={e => setData('id_proof_number', e.target.value)} />
                    {errors.id_proof_number && <div className="text-red-500 text-xs">{errors.id_proof_number}</div>}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 justify-end mt-4">
              <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={processing}>Add & Select Guest</Button>
            </div>
          </>
        )}
      </form>
    </div>
  )
}
