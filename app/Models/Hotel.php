<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hotel extends Model
{
    protected $fillable = [
        'name',
        'description',
        'address',
        'city',
        'state',
        'country',
        'pincode',
        'phone',
        'email',
        'website',
        'check_in_time',
        'check_out_time',
        'status'
    ];

    public function branches()
    {
        return $this->hasMany(HotelBranch::class);
    }
    public function rooms()
    {
        return $this->hasMany(Room::class);
    }
    public function packages()
    {
        return $this->hasMany(Package::class);
    }
    public function taxes()
    {
        return $this->hasMany(Tax::class);
    }
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
    public function staff()
    {
        return $this->hasMany(Staff::class);
    }
}
