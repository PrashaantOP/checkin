<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'booking_id',
        'payment_method_id',
        'transaction_id',
        'amount',
        'payment_date',
        'status'
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
    public function method()
    {
        return $this->belongsTo(PaymentMethod::class, 'payment_method_id');
    }
}
