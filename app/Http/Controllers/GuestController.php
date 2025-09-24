<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use Illuminate\Http\Request;

class GuestController extends Controller
{
    public function searchByMobile(Request $request)
    {
        $mobile = $request->query('mobile');
        $guests = [];
        if ($mobile && strlen($mobile) >= 4) {
            $guests = \App\Models\Guest::where('phone', 'like', $mobile . '%')
                ->limit(10)
                ->get();
        }
        return response()->json([
            'guests' => $guests // returns an array!
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name'      => 'required|string|max:255',
            'last_name'       => 'nullable|string|max:255',
            'phone'           => 'required|string|max:15|unique:guests,phone',
            'email'           => 'nullable|email|max:255',
            'address'         => 'nullable|string|max:255',
            'city'            => 'nullable|string|max:100',
            'country'         => 'nullable|string|max:100',
            'id_proof_type'   => 'nullable|in:Aadhar,Voter,PAN',
            'id_proof_number' => 'nullable|string|max:50',
        ]);

        $guest = \App\Models\Guest::create($validated);

        return response()->json([
            'guest' => [
                'id' => $guest->id,
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
