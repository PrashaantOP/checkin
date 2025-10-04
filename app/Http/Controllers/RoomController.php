<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Room;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        $currentHotelId = session('current_hotel_id');
        $rooms = Room::with('amenities') // Eager load amenities
            ->where('hotel_id', $currentHotelId)
            ->latest()->paginate(10);

        return inertia('backend/Rooms/Index', [
            'rooms' => $rooms
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'required|string|max:255',
            'max_guests' => 'required|integer|min:1',
            'base_price' => 'required|numeric|min:0',
            'status' => 'required|string|max:50',
        ]);
        $data['hotel_id'] = session('current_hotel_id');
        Room::create($data);

        return redirect()->route('rooms.index')->with('success', 'Room added!');
    }

    public function update(Request $request, Room $room)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'required|string|max:255',
            'max_guests' => 'required|integer|min:1',
            'base_price' => 'required|numeric|min:0',
            'status' => 'required|string|max:50',
        ]);

        $room->update($data);

        return redirect()->route('rooms.index')->with('success', 'Room updated!');
    }
}
