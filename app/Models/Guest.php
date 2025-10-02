<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Guest extends Model
{
    protected $fillable = [
        'hotel_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'address',
        'city',
        'country',
        'id_proof_type',
        'id_proof_number',
        'is_profile_completed',
    ];

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }

    public function bookingGuests()
    {
        return $this->hasMany(BookingGuest::class, 'guest_id');
    }
    public function bookings()
    {
        return $this->belongsToMany(Booking::class, 'booking_guests');
    }


    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
