<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Checkin extends Model
{
    protected $fillable = [
        'booking_id',
        'checkin_time',
        'assigned_staff',
        'notes'
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
    public function assignedStaff()
    {
        return $this->belongsTo(User::class, 'assigned_staff');
    }
}
