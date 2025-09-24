<?php

namespace Database\Seeders;

use App\Models\HotelUsers;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class HotelManagementSeeder extends Seeder
{
    public function run(): void
    {
        // -------- Hotels --------
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

        // -------- Hotel Branches --------
        DB::table('hotel_branches')->insert([
            [
                'hotel_id' => 1,
                'name' => 'Grand Palace Branch 1',
                'address' => 'MG Road, Patna',
                'phone' => '9998887777',
                'email' => 'branch1@grandpalace.com',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // -------- Amenities --------
        DB::table('amenities')->insert([
            ['name' => 'Free WiFi', 'description' => 'High speed internet access', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Air Conditioning', 'description' => 'Room AC with climate control', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Television', 'description' => 'LED Smart TV', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Room Service', 'description' => '24/7 room service', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // -------- Rooms --------
        DB::table('rooms')->insert([
            [
                'hotel_id' => 1,
                'name' => 'Deluxe Room',
                'description' => 'Spacious deluxe room with king size bed.',
                'max_guests' => 2,
                'base_price' => 3500.00,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'hotel_id' => 1,
                'name' => 'Suite',
                'description' => 'Luxury suite with living area.',
                'max_guests' => 4,
                'base_price' => 7000.00,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // -------- Room Inventory --------
        DB::table('room_inventory')->insert([
            ['room_id' => 1, 'room_number' => '101', 'floor_number' => '1', 'status' => 'available', 'created_at' => now(), 'updated_at' => now()],
            ['room_id' => 1, 'room_number' => '102', 'floor_number' => '1', 'status' => 'available', 'created_at' => now(), 'updated_at' => now()],
            ['room_id' => 2, 'room_number' => '201', 'floor_number' => '2', 'status' => 'available', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // -------- Room Amenities --------
        DB::table('room_amenities')->insert([
            ['room_id' => 1, 'amenity_id' => 1],
            ['room_id' => 1, 'amenity_id' => 2],
            ['room_id' => 2, 'amenity_id' => 1],
            ['room_id' => 2, 'amenity_id' => 3],
        ]);

        // -------- Guests --------
        DB::table('guests')->insert([
            [
                'first_name' => 'Rahul',
                'last_name' => 'Kumar',
                'email' => 'rahul@example.com',
                'phone' => '9876541111',
                'address' => 'Patliputra Colony',
                'city' => 'Patna',
                'country' => 'India',
                'id_proof_type' => 'Aadhar',
                'id_proof_number' => '1234-5678-9012',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // -------- Roles --------
        DB::table('roles')->insert([
            ['name' => 'admin', 'description' => 'Administrator'],
            ['name' => 'manager', 'description' => 'Hotel Manager'],
            ['name' => 'staff', 'description' => 'Hotel Staff'],
            ['name' => 'guest', 'description' => 'Hotel Guest'],
        ]);

        // -------- Packages --------
        DB::table('packages')->insert([
            [
                'hotel_id' => 1,
                'name' => 'Breakfast Package',
                'description' => 'Buffet breakfast for 2',
                'price' => 500.00,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'hotel_id' => 1,
                'name' => 'Spa Package',
                'description' => 'Relaxing spa session',
                'price' => 2000.00,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // -------- Payment Methods --------
        DB::table('payment_methods')->insert([
            ['name' => 'Cash', 'description' => 'Cash Payment', 'status' => 'active'],
            ['name' => 'Card', 'description' => 'Credit/Debit Card Payment', 'status' => 'active'],
            ['name' => 'Razorpay', 'description' => 'Online Payment via Razorpay', 'status' => 'active'],
            ['name' => 'UPI', 'description' => 'UPI Payment', 'status' => 'active'],
        ]);

        // -------- Taxes --------
        DB::table('taxes')->insert([
            [
                'hotel_id' => 1,
                'name' => 'GST',
                'type' => 'percent',
                'rate' => 18.00,
                'inclusive' => false,
                'status' => 'active',
            ],
            [
                'hotel_id' => 1,
                'name' => 'Service Charge',
                'type' => 'fixed',
                'rate' => 200.00,
                'inclusive' => true,
                'status' => 'active',
            ]
        ]);
    }
}
