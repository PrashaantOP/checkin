<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class RoomAmenity extends Pivot
{
    protected $table = 'room_amenities';
    protected $fillable = [
        'room_id',
        'amenity_id'
    ];
}
