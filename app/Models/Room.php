<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = [
        'hotel_id',
        'name',
        'description',
        'max_guests',
        'base_price',
        'status'
    ];

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }
    public function amenities()
    {
        return $this->belongsToMany(Amenity::class, 'room_amenities');
    }
    public function prices()
    {
        return $this->hasMany(RoomPrice::class);
    }
    public function inventory()
    {
        return $this->hasMany(RoomInventory::class);
    }
}
