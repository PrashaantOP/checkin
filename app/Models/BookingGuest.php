<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingGuest extends Model
{
    protected $table = 'booking_guests'; // Table name

    protected $fillable = [
        'booking_id',
        'guest_id',
        // Add more fields if ever you expand pivot!
    ];

    // Optional: timestamps auto-enabled for pivot

    // Relationship to Booking
    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }

    // Relationship to Guest
    public function guest()
    {
        return $this->belongsTo(Guest::class, 'guest_id');
    }
}
