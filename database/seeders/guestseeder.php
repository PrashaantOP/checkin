<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class guestseeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
{
    DB::table('guests')->insert([
        [
            'hotel_id' => 1,
            'first_name' => 'Rahul',
            'last_name' => 'Kumar',
            'email' => 'rahul@example.com',
            'phone' => '9876541111',
            'address' => 'Patliputra Colony',
            'city' => 'Patna',
            'country' => 'India',
            'id_proof_type' => 'Aadhar',
            'id_proof_number' => '1234-5678-9012',
            'is_profile_completed' => '0',
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'hotel_id' => 1,
            'first_name' => 'Rahul',
            'last_name' => 'Kumar',
            'email' => 'rahuls@example.com',
            'phone' => '9876541131',
            'address' => 'Patliputra Colony',
            'city' => 'Patna',
            'country' => 'India',
            'id_proof_type' => 'Aadhar',
            'id_proof_number' => '1234-5678-9018',
            'is_profile_completed' => '0',
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'hotel_id' => 1,
            'first_name' => 'Rahul',
            'last_name' => 'Kumar',
            'email' => 'rahsdul@example.com',
            'phone' => '9876581111',
            'address' => 'Patliputra Colony',
            'city' => 'Patna',
            'country' => 'India',
            'id_proof_type' => 'Aadhar',
            'id_proof_number' => '1234-5678-9017',
            'is_profile_completed' => '0',
            'created_at' => now(),
            'updated_at' => now(),
        ]
    ]);
}

}
