<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();

        $user = $request->user();

        // Filter hotel relation by correct status type (int/bool or string 'active')
        // Infer status type: You can change 'active' to true/1 as per your DB
        $hotel = $user->hotels()->wherePivot('status', 1)->first(); // for enum type
        // $hotel = $user->hotels()->wherePivot('status', 1)->first(); // for integer/bool type

        if ($hotel) {
            // Session store if related hotel found
            Session::put('current_hotel_id', $hotel->id);
            Session::put('switched_hotel', $hotel);

            // Store Role In Session Here
            $role = $hotel->pivot->role ?? null;
            Session::put('current_role', $role);
        } else {
            // Fallback handling (no hotel found for user)
            Session::forget('current_hotel_id');
            Session::forget('switched_hotel');
            Session::forget('current_role');
            // Optionally, flash a warning
            session()->flash('error', 'No hotel assigned to your account!');
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }


    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
