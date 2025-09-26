<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class hotelseeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('hotels')->insert([
            [
                'name' => 'Grand Palace Hotel',
                'description' => 'A luxury 5-star hotel in the city center.',
                'address' => '123 Main Street',
                'city' => 'Patna',
                'state' => 'Bihar',
                'country' => 'India',
                'pincode' => '800001',
                'phone' => '9876543210',
                'email' => 'info@grandpalace.com',
                'website' => 'https://grandpalace.com',
                'check_in_time' => '12:00:00',
                'check_out_time' => '11:00:00',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
