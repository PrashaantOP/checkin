<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{
    protected $fillable = [
        'hotel_id',
        'user_id',
        'designation',
        'phone',
        'status'
    ];

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
