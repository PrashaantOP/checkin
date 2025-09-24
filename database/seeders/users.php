<?php

namespace Database\Seeders;

use App\Models\HotelUsers;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class users extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Prashant Kumar',
            'email' => 'pk1093524@gmail.com',
            'image' => '1683556099907.jpeg',
            'mobile' => '6204709038',
            'password' => Hash::make('sachin@12345'),
            'email_verified_at' => now(),
            'otp' => null,
            'otp_expires_at' => null,
            'remember_token' => Str::random(10),
        ]);
        User::create([
            'name' => 'Prashant Kumar',
            'email' => 'pk1093525@gmail.com',
            'image' => '1683556099907.jpeg',
            'mobile' => '0123456789',
            'password' => Hash::make('sachin@12345'),
            'email_verified_at' => now(),
            'otp' => null,
            'otp_expires_at' => null,
            'remember_token' => Str::random(10),
        ]);

        HotelUsers::create([
            'hotel_id' => 1,
            'user_id' => 1,
            'role' => 'admin',
            'status' => 1,
        ]);
    }
}
