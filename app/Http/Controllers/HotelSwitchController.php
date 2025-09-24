<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class HotelSwitchController extends Controller
{
    public function switchHotel(Request $request)
    {
        $request->validate([
            'hotel_id' => 'required|exists:hotels,id',
        ]);

        $user = Auth::user();

        // Ensure the user is allowed to switch to this restaurant
        if (!$user->hotels()->where('hotel_id', $request->hotel_id)->exists()) {
            abort(403, 'Unauthorized restaurant switch.');
        }
        $hotel = Hotel::where('id', $request->hotel_id)->first();

        // Set the session value using Facades\Session
        Session::put('current_hotel_id', $request->hotel_id);
        Session::put('switched_hotel', $hotel);

        return back()->with('success', 'Successfully switched to .' . $hotel->name);
    }
}
