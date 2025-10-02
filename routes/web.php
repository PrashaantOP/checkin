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

    //booking route
    Route::get('/bookings', [BookingController::class, 'index'])->name('bookings.index');
    Route::get('/bookings/create', [BookingController::class, 'create'])->name('bookings.create');
    Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');
    Route::get('/bookings/{booking}/edit', [BookingController::class, 'edit'])->name('bookings.edit');
    Route::put('/bookings/{booking}', [BookingController::class, 'update'])->name('bookings.update');
    Route::delete('/bookings/{booking}', [BookingController::class, 'destroy'])->name('bookings.destroy');

    Route::get('/guests/search', [GuestController::class, 'searchByMobile']);
    Route::post('/guests', [GuestController::class, 'store']);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
