<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class HotelUsers extends Pivot
{
    protected $table = 'hotel_users';

    protected $fillable = [
        'hotel_id',
        'user_id',
        'role',
        'status',
    ];

    public $timestamps = true; // because your pivot table has created_at and updated_at
}
