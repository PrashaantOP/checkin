<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tax extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'hotel_id',
        'name',
        'type',
        'rate',
        'inclusive',
        'status'
    ];

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }
}
