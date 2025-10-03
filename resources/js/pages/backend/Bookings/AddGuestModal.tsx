import { useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useRef } from 'react'
import axios from 'axios'
import { Search } from 'lucide-react' // Lucide icon

const idProofTypes = [
  { value: '', label: 'Select ID Proof' },
  { value: 'Aadhar', label: 'Aadhar Card' },
  { value: 'Voter', label: 'Voter ID' },
  { value: 'PAN', label: 'PAN Card' }
]

function Switch({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${checked ? 'bg-green-600' : 'bg-gray-300'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  )
}

export default function AddGuestModal({ onSelect, onClose }) {
  const [matchedGuests, setMatchedGuests] = useState([])
  const [searching, setSearching] = useState(false)
  const [showForm, setShowForm] = useState(true)
  const [existingGuest, setExistingGuest] = useState(null)
  const [readOnly, setReadOnly] = useState(false)
  const inputRef = useRef(null)

  const { data, setData, post, processing, errors, reset } = useForm({
    first_name: '',
    last_name: '',
    mobile: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    country: '',
    id_proof_type: '',
    id_proof_number: '',
  })

  // Search guests by id proof OR mobile
  const searchGuests = async e => {
    e.preventDefault()
    setSearching(true)
    setMatchedGuests([])
    // Prefer id proof for search, otherwise fallback to mobile
    let res
    try {
      if (data.id_proof_type && data.id_proof_number) {
        res = await axios.get(`/guests/search?id_proof_type=${data.id_proof_type}&id_proof_number=${data.id_proof_number}`)
      } else if (data.mobile) {
        res = await axios.get(`/guests/search?mobile=${data.mobile}`)
      } else {
        setSearching(false)
        return
      }
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
  }

  // Select existing guest: fill & enable/disable fields accordingly
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
    setMatchedGuests([])
    setExistingGuest(guest)
    setShowForm(true)
    setReadOnly(guest.is_profile_completed === 1)
  }

  // Change guest: clear and unlock
  const handleChangeGuest = () => {
    setExistingGuest(null)
    setReadOnly(false)
    reset()
    inputRef.current?.focus()
  }

  // On submit
  const submit = async e => {
    e.preventDefault()
    setData('phone', data.mobile)
    if (!data.id_proof_type || !data.id_proof_number) return alert('ID proof required!')
    if (existingGuest && readOnly) {
      onSelect(existingGuest)
      reset()
      setExistingGuest(null)
      setReadOnly(false)
      onClose()
      return
    }
    try {
      const res = await axios.post('/guests', {
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.mobile,
        email: data.email,
        address: data.address,
        city: data.city,
        country: data.country,
        id_proof_type: data.id_proof_type,
        id_proof_number: data.id_proof_number
      })
      if (res.data && res.data.guest) {
        onSelect(res.data.guest)
        reset()
        setExistingGuest(null)
        setReadOnly(false)
        onClose()
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="p-6 space-y-4 relative">
      <h2 className="text-lg font-bold mb-2">Add Guest</h2>
      <form onSubmit={e => { e.preventDefault(); }}>
        {/* SEARCH FIELD */}
        {/* <hr className="mb-3" /> */}
        <div className="mb-4">
  {/* <div className="font-semibold text-base flex items-center gap-2 mb-2">
    <Search className="w-5 h-5" />
    Search Guest
  </div>
  <hr className="mb-3" /> */}
  
  <div className="relative">
    <label className="block text-xs mb-1">Search Guest</label>
    <div className="relative">
      <Input
        type="text"
        placeholder="Enter ID Proof Number or Mobile"
        value={data.guest_search}
        onChange={async e => {
          setData('guest_search', e.target.value)
          // OPTIONAL: Add debounce for API hit control
          if (e.target.value.length >= 4) {
            setSearching(true)
            try {
              // Prefer ID proof pattern match, else mobile
              let res
              const val = e.target.value
              if (/[a-zA-Z]/.test(val)) { // If contains alphabets, try id proof search
                res = await axios.get(`/guests/search?id_proof_or_mobile=${val}`)
              } else {
                res = await axios.get(`/guests/search?mobile=${val}`)
              }
              setMatchedGuests(res.data?.guests ?? [])
            } catch {
              setMatchedGuests([])
            }
            setSearching(false)
          } else {
            setMatchedGuests([])
          }
        }}
        className="pl-9"
        required // make required if you need
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <Search className="w-4 h-4" />
      </span>
    </div>
    {errors.guest_search && <div className="text-red-500 text-xs">{errors.guest_search}</div>}
  </div>
  <hr className="mt-3" />
</div>

      </form>
      {searching && <div className="text-xs text-gray-600">Searching...</div>}
      {matchedGuests.length > 0 && !existingGuest && (
        <div className="absolute left-0 top-30 z-50 w-full bg-white shadow-lg border rounded-lg max-h-48 overflow-y-auto" style={{ minWidth: '260px' }}>
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
      {/* FORM FIELDS */}
      {(showForm || existingGuest) && (
        <form onSubmit={submit} className="space-y-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-xs">First Name<span className="text-red-500">*</span></label>
              <Input value={data.first_name} onChange={e => setData('first_name', e.target.value)} required disabled={readOnly} />
              {errors.first_name && <div className="text-red-500 text-xs">{errors.first_name}</div>}
            </div>
            {existingGuest && (
              <Button type="button" variant="secondary" className="h-9 px-3" onClick={handleChangeGuest}>Change Guest</Button>
            )}
          </div>
          <div>
            <label className="block text-xs">Last Name</label>
            <Input value={data.last_name} onChange={e => setData('last_name', e.target.value)} disabled={readOnly} />
            {errors.last_name && <div className="text-red-500 text-xs">{errors.last_name}</div>}
          </div>
          {/* Mobile comes here, not required */}
          <div>
            <label className="block text-xs">Mobile</label>
            <Input
              value={data.mobile}
              onChange={e => setData('mobile', e.target.value)}
              maxLength={15}
              minLength={4}
              disabled={readOnly}
            />
            {errors.mobile && <div className="text-red-500 text-xs">{errors.mobile}</div>}
          </div>
          {/* ID Proof always required/show */}
          <div className="grid gap-3 md:grid-cols-2 mt-2">
            <div>
              <label className="block text-xs">ID Proof Type<span className="text-red-500">*</span></label>
              <select
                value={data.id_proof_type}
                onChange={e => setData('id_proof_type', e.target.value)}
                className="w-full rounded border px-3 py-2"
                required
                disabled={readOnly}
              >
                {idProofTypes.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              {errors.id_proof_type && <div className="text-red-500 text-xs">{errors.id_proof_type}</div>}
            </div>
            <div>
              <label className="block text-xs">ID Proof Number<span className="text-red-500">*</span></label>
              <Input
                value={data.id_proof_number}
                onChange={e => setData('id_proof_number', e.target.value)}
                required
                disabled={readOnly}
              />
              {errors.id_proof_number && <div className="text-red-500 text-xs">{errors.id_proof_number}</div>}
            </div>
          </div>
          <div>
            <label className="block text-xs">Email</label>
            <Input value={data.email} onChange={e => setData('email', e.target.value)} disabled={readOnly} />
            {errors.email && <div className="text-red-500 text-xs">{errors.email}</div>}
          </div>
          <div>
            <label className="block text-xs">Address</label>
            <Input value={data.address} onChange={e => setData('address', e.target.value)} disabled={readOnly} />
            {errors.address && <div className="text-red-500 text-xs">{errors.address}</div>}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-xs">City</label>
              <Input value={data.city} onChange={e => setData('city', e.target.value)} disabled={readOnly} />
              {errors.city && <div className="text-red-500 text-xs">{errors.city}</div>}
            </div>
            <div>
              <label className="block text-xs">Country</label>
              <Input value={data.country} onChange={e => setData('country', e.target.value)} disabled={readOnly} />
              {errors.country && <div className="text-red-500 text-xs">{errors.country}</div>}
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-4">
            <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={processing}>Add & Select Guest</Button>
          </div>
        </form>
      )}
    </div>
  )
}
