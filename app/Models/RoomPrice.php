<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoomPrice extends Model
{
    protected $fillable = [
        'room_id',
        'date',
        'price'
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}
