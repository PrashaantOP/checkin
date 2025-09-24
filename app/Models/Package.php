<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    protected $fillable = [
        'hotel_id',
        'name',
        'description',
        'price',
        'status'
    ];

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }
    public function bookingPackages()
    {
        return $this->hasMany(BookingPackage::class);
    }
}
