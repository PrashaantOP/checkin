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
    [key: string]: any
  }

  export default function GuestDetails({ guest }: { guest: Guest }) {
    return (
      <div className="flex flex-col gap-2 p-2 min-w-[300px]">
        <h2 className="text-lg font-bold mb-2">
          {guest.first_name} {guest.last_name}
        </h2>
        {guest.email && <p><b>Email:</b> {guest.email}</p>}
        {guest.phone && <p><b>Phone:</b> {guest.phone}</p>}
        {guest.address && <p><b>Address:</b> {guest.address}</p>}
        {guest.city && <p><b>City:</b> {guest.city}</p>}
        {guest.country && <p><b>Country:</b> {guest.country}</p>}
        {guest.id_proof_type && <p><b>ID Proof Type:</b> {guest.id_proof_type}</p>}
        {guest.id_proof_number && <p><b>ID Proof #:</b> {guest.id_proof_number}</p>}
        <p><b>Profile Completed:</b> {guest.is_profile_completed ? 'Yes' : 'No'}</p>
      </div>
    )
  }
