import { Head, router } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import RoomFormModal from './RoomFormModal'

type Room = {
  id: number
  name: string
  description: string
  max_guests: number
  base_price: number
  status: string
}

interface RoomsIndexProps {
  rooms: {
    data: Room[]
    links?: any[]
  }
}

const breadcrumbs = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Rooms', href: '/rooms' }
]

export default function RoomsIndex({ rooms }: RoomsIndexProps) {
  const [pageLoading, setPageLoading] = useState(false)

  const handleSaveRoom = (roomData: Room) => {
    if (roomData.id) {
      // Edit existing room
      router.put(`/rooms/${roomData.id}`, roomData, {
        onStart: () => setPageLoading(true),
        onFinish: () => setPageLoading(false)
      })
    } else {
      // Create new room
      router.post('/rooms', roomData, {
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

  const hasRooms = rooms.data && rooms.data.length > 0

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Rooms" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border p-4 bg-white dark:bg-neutral-900">
          <div className="flex justify-between mb-4">
            <h1 className="text-xl font-bold">Rooms</h1>
            <RoomFormModal onSave={handleSaveRoom} buttonText="Add Room" />
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden dark:border-neutral-700 bg-white dark:bg-neutral-900">
            {pageLoading ? (
              <div className="flex justify-center py-20">
                <span className="text-xl text-gray-600 dark:text-neutral-400 font-semibold">
                  Loading...
                </span>
              </div>
            ) : hasRooms ? (
              <>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                  <thead className="bg-gray-50 dark:bg-neutral-700">
                    <tr>
                      <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">ID</th>
                      <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Name</th>
                      <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden md:table-cell">Description</th>
                      <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden md:table-cell">Max Guests</th>
                      <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden md:table-cell">Base Price</th>
                      <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden lg:table-cell">Status</th>
                      <th className="px-4 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                    {rooms.data.map(room => (
                      <tr key={room.id}>
                        <td className="px-4 py-4 text-sm font-medium text-gray-800 dark:text-neutral-200">
                          #{room.id}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200">
                          {room.name}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200 hidden md:table-cell">
                          <span title={room.description}>
                            {room.description.length > 50 ? room.description.substring(0, 50) + "..." : room.description}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200 hidden md:table-cell">
                          {room.max_guests}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200 hidden md:table-cell">
                          ₹{room.base_price}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200 hidden lg:table-cell">
                          <span className={`px-2 py-1 rounded text-xs ${
                            room.status === 'available' ? 'bg-green-100 text-green-800' :
                            room.status === 'occupied' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {room.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-end text-sm font-medium">
                          <div className="flex gap-x-3 justify-end">
                            <RoomFormModal
                              room={room}
                              onSave={handleSaveRoom}
                              buttonText={<Pencil className="w-4 h-4" />}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {rooms.links && rooms.links.length > 3 && (
                  <div className="flex justify-start px-4 items-center gap-2 my-6">
                    {rooms.links.map((link, i) => (
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
                  No rooms available for this hotel yet.
                </p>
                <RoomFormModal onSave={handleSaveRoom} buttonText="Add First Room" />
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
