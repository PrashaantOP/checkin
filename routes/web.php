<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\HotelSwitchController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::post('/hotel/switch', [HotelSwitchController::class, 'switchHotel'])->middleware('auth');


    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('bookings', BookingController::class);
    Route::get('/guests/search', [GuestController::class, 'searchByMobile']);
    Route::post('/guests', [GuestController::class, 'store']);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
