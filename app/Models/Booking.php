<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'hotel_id',
        'guest_id',
        'booking_number',
        'check_in_date',
        'check_out_date',
        'total_guests',
        'total_amount',
        'discount',
        'tax_amount',
        'grand_total',
        'status',
        'payment_status'
    ];

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }
    public function guest()
    {
        return $this->belongsTo(Guest::class);
    }
    public function rooms()
    {
        return $this->hasMany(BookingRoom::class);
    }
    public function packages()
    {
        return $this->hasMany(BookingPackage::class);
    }
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
    public function checkin()
    {
        return $this->hasOne(Checkin::class);
    }
    public function checkout()
    {
        return $this->hasOne(Checkout::class);
    }
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
