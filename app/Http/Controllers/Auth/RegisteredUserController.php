<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Hotel;
use App\Models\HotelUsers;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $hotel = Hotel::create([
            'name' => 'Your Restaurant',
            'email' => $request->email,
            'address' => 'Your Address',
            'city' => 'Your City',
            'state' => 'Your State',
            'country' => 'Your Country',
            'pincode' => '000000',
            'phone' => '0000000000',
            'status' => 'active',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        HotelUsers::create([
            'user_id' => $user->id,
            'hotel_id' => $hotel->id,
            'role' => 'admin',
            'status' => true,
        ]);

        event(new Registered($user));

        Auth::login($user);

        // Set session for current restaurant
        Session::put('current_hotel_id', $hotel->id);
        Session::put('switched_hotel', $hotel);

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
