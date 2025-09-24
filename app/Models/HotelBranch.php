<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HotelBranch extends Model
{
    protected $fillable = [
        'hotel_id',
        'name',
        'address',
        'phone',
        'email',
        'status'
    ];

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }
}
