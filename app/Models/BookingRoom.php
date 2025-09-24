<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingRoom extends Model
{
    protected $fillable = [
        'booking_id',
        'room_inventory_id',
        'guests_count',
        'price_per_night',
        'nights',
        'subtotal'
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
    public function roomInventory()
    {
        return $this->belongsTo(RoomInventory::class);
    }
}
