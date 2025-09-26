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
        'id_proof_number'
    ];

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
