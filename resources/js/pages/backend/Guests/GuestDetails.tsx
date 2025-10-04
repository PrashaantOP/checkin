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

  export default function GuestDetails({ guest }: { guest: Guest }) {
    return (
      <div className="flex flex-col items-center p-6 w-full mx-auto bg-white dark:bg-neutral-900 rounded-xl shadow-lg">
        {/* Profile Pic or Initials as Avatar */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-200 dark:bg-neutral-700 mb-4">
          <span className="text-3xl font-bold text-gray-700 dark:text-neutral-200">
            {guest.first_name?.[0] ?? ''}{guest.last_name?.[0] ?? ''}
          </span>
        </div>
        {/* Name */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {guest.first_name} {guest.last_name}
        </h2>
        {/* Status badge */}
        <div className="mb-4">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${guest.is_profile_completed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {guest.is_profile_completed ? 'Profile Completed' : 'Profile Incomplete'}
          </span>
        </div>
        {/* Details */}
        <div className="w-full flex flex-col gap-4">
          {guest.email && (
            <ProfileField label="Email" value={guest.email} />
          )}
          {guest.phone && (
            <ProfileField label="Phone" value={guest.phone} />
          )}
          {(guest.city || guest.country) && (
            <div className="flex gap-7">
              {guest.city && <ProfileField label="City" value={guest.city} horizontal />}
              {guest.country && <ProfileField label="Country" value={guest.country} horizontal />}
            </div>
          )}
          {guest.address && (
            <ProfileField label="Address" value={guest.address} />
          )}
          {(guest.id_proof_type || guest.id_proof_number) &&
            <div className="flex gap-7">
              {guest.id_proof_type && <ProfileField label="ID Type" value={guest.id_proof_type} horizontal />}
              {guest.id_proof_number && <ProfileField label="ID Number" value={guest.id_proof_number} horizontal />}
            </div>
          }
        </div>
      </div>
    )
  }

  // Sub-component for a profile field
  function ProfileField({ label, value, horizontal = false }: { label: string; value: string; horizontal?: boolean }) {
    return (
      <div className={horizontal ? 'flex flex-col flex-1' : ''}>
        <span className="text-xs font-semibold text-gray-500 dark:text-neutral-400">{label}: </span>
        <span className="text-base font-medium text-gray-900 dark:text-neutral-200 break-all">{value}</span>
      </div>
    )
  }
