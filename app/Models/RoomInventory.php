<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoomInventory extends Model
{
    protected $table = 'room_inventory';

    protected $fillable = [
        'room_id',
        'room_number',
        'floor_number',
        'status'
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
    public function bookingRooms()
    {
        return $this->hasMany(BookingRoom::class);
    }
    public function maintenance()
    {
        return $this->hasMany(Maintenance::class);
    }
}
