<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'booking_id',
        'invoice_number',
        'invoice_date',
        'subtotal',
        'tax_amount',
        'discount',
        'grand_total',
        'status'
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
