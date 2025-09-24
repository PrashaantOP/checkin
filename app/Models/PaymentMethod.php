<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'name',
        'description',
        'status'
    ];

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
