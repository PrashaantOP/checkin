<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Guest;
use App\Models\Hotel;
use App\Models\RoomInventory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function index()
    {
        // Paginate and eager load related guest, hotel, etc. as needed
        $bookings = Booking::with(['guest', 'hotel', 'rooms.roomInventory'])
            ->latest()->paginate(20);
        // dd($bookings);
        return Inertia::render('backend/Bookings/Index', [
            'bookings' => $bookings,
            'guests' => Guest::select('id', 'first_name', 'last_name')->get(),
            'hotels' => Hotel::select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'hotel_id' => 'required|exists:hotels,id',
            'guest_id' => 'required|exists:guests,id',
            'booking_number' => 'required|unique:bookings,booking_number',
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date|after:check_in_date',
            'total_guests' => 'required|integer|min:1',
            // More fields as per your table
        ]);
        $booking = Booking::create($data);

        // Add room/package/relations if needed

        return redirect()->route('bookings.index')->with('success', 'Booking created!');
    }

    public function update(Request $request, Booking $booking)
    {
        $data = $request->validate([
            // Same as store, except uniqueness rule for booking_number
        ]);
        $booking->update($data);
        // Update relations if needed
        return back()->with('success', 'Booking updated!');
    }

    public function destroy(Booking $booking)
    {
        $booking->delete();
        return back()->with('success', 'Booking deleted!');
    }

    public function show(Booking $booking)
    {
        return Inertia::render('backend/Bookings/Show', [
            'booking' => $booking->load('guest', 'hotel', 'rooms.roomInventory')
        ]);
    }
}
