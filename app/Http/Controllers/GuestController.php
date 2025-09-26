<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use Illuminate\Http\Request;

class GuestController extends Controller
{
    public function searchByMobile(Request $request)
    {
        $mobile = $request->query('mobile');
        $currentHotelId = session('current_hotel_id'); // pass this in frontend!
        $guests = [];
        if ($mobile && strlen($mobile) >= 4 && $currentHotelId) {
            $guests = \App\Models\Guest::where('hotel_id', $currentHotelId)
                ->where('phone', 'like', $mobile . '%')
                ->limit(10)
                ->get();
        }
        return response()->json([
            'guests' => $guests
        ]);
    }


    public function store(Request $request)
{
    $currentHotelId = session('current_hotel_id');
    // You can also get from $request->hotel_id if posting it from React

    // Add hotel_id check to query (for multi-hotel)
    $existingGuest = \App\Models\Guest::where('hotel_id', $currentHotelId)
        ->where('phone', $request->phone)
        ->first();

    if ($existingGuest) {
        return response()->json([
            'guest' => [
                'id' => $existingGuest->id,
                'hotel_id' => $existingGuest->hotel_id,
                'first_name' => $existingGuest->first_name,
                'last_name' => $existingGuest->last_name,
                'phone' => $existingGuest->phone,
                'email' => $existingGuest->email,
                'address' => $existingGuest->address,
                'city' => $existingGuest->city,
                'country' => $existingGuest->country,
                'id_proof_type' => $existingGuest->id_proof_type,
                'id_proof_number' => $existingGuest->id_proof_number,
            ]
        ]);
    }

    $validated = $request->validate([
        'first_name'      => 'required|string|max:255',
        'last_name'       => 'nullable|string|max:255',
        'phone'           => [
            'required',
            'string',
            'max:15',
            // Unique per hotel for safety
            \Illuminate\Validation\Rule::unique('guests')->where('hotel_id', $currentHotelId)
        ],
        'email'           => 'nullable|email|max:255',
        'address'         => 'nullable|string|max:255',
        'city'            => 'nullable|string|max:100',
        'country'         => 'nullable|string|max:100',
        'id_proof_type'   => 'nullable|in:Aadhar,Voter,PAN',
        'id_proof_number' => 'nullable|string|max:50',
    ]);

    // Always force current hotel
    $validated['hotel_id'] = $currentHotelId;

    $guest = \App\Models\Guest::create($validated);

    return response()->json([
        'guest' => [
            'id' => $guest->id,
            'hotel_id' => $guest->hotel_id,
            'first_name' => $guest->first_name,
            'last_name' => $guest->last_name,
            'phone' => $guest->phone,
            'email' => $guest->email,
            'address' => $guest->address,
            'city' => $guest->city,
            'country' => $guest->country,
            'id_proof_type' => $guest->id_proof_type,
            'id_proof_number' => $guest->id_proof_number,
        ]
    ]);
}


}
