<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use Illuminate\Http\Request;

class GuestController extends Controller
{

    public function index(Request $request)
    {
        $currentHotelId = session('current_hotel_id');
        $guests = Guest::where('hotel_id', $currentHotelId)->latest()->paginate(10); // pagination as needed

        return inertia('backend/Guests/Index', [  // adjust inertia path as per your structure!
            'guests' => $guests
        ]);
    }
    public function searchByMobile(Request $request)
    {
        $mobile = $request->query('mobile');
        $currentHotelId = session('current_hotel_id'); // pass this in frontend!
        $guests = [];
        if ($mobile && strlen($mobile) >= 4 && $currentHotelId) {
            $guests = \App\Models\Guest::where('hotel_id', $currentHotelId)
                ->where('phone', 'like', $mobile . '%')
                ->orWhere('id_proof_number', 'like', $mobile . '%')
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

        // --- Validation rules, unique except for self (update) if guest exists---
        $rules = [
            'first_name'      => 'required|string|max:255',
            'last_name'       => 'nullable|string|max:255',
            'phone'           => [
                'required',
                'string',
                'max:15',
            ],
            'email'           => 'nullable|email|max:255',
            'address'         => 'nullable|string|max:255',
            'city'            => 'nullable|string|max:100',
            'country'         => 'nullable|string|max:100',
            'id_proof_type'   => 'nullable|in:Aadhar,Voter,PAN',
            'id_proof_number' => 'nullable|string|max:50',
        ];

        $validated = $request->validate($rules);

        // Always force current hotel
        $validated['hotel_id'] = $currentHotelId;

        // Check if guest exists by phone and hotel_id
        $existingGuest = \App\Models\Guest::where('hotel_id', $currentHotelId)
            ->where('phone', $validated['phone'])
            ->first();

        if ($existingGuest) {
            // Update guest with new data
            $existingGuest->update($validated);
            $guest = $existingGuest;
        } else {
            // Insert new guest
            // Add unique phone validation for create only
            $request->validate([
                'phone' => [
                    'required',
                    'string',
                    'max:15',
                    \Illuminate\Validation\Rule::unique('guests')->where('hotel_id', $currentHotelId),
                ],
            ]);
            $guest = \App\Models\Guest::create($validated);
        }

        // Return the required data (for both insert & update)
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

    public function storenew(Request $request)
    {
        $data = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|max:150',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'country' => 'required|string|max:100',
            'id_proof_type' => 'required|string|max:100',
            'id_proof_number' => 'required|string|max:100',
            'is_profile_completed' => 'boolean'
        ]);

        // Automatically assign hotel_id from session:
        $data['hotel_id'] = session('current_hotel_id');

        Guest::create($data);

        // You can adjust redirect/response as per SPA
        return redirect()->route('guests.index')->with('success', 'Guest added successfully!');
    }

    public function update(Request $request, Guest $guest)
    {
        $data = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|max:150',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'country' => 'required|string|max:100',
            'id_proof_type' => 'required|string|max:100',
            'id_proof_number' => 'required|string|max:100',
            'is_profile_completed' => 'boolean'
        ]);

        $guest->update($data);

        return redirect()->route('guests.index')->with('success', 'Guest updated successfully!');
    }
}
