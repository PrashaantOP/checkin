<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Maintenance extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'room_inventory_id',
        'issue',
        'reported_date',
        'resolved_date',
        'status'
    ];

    public function roomInventory()
    {
        return $this->belongsTo(RoomInventory::class);
    }
}
