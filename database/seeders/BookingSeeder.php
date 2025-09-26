<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Hotel;
use App\Models\Guest;
use App\Models\Room;
use App\Models\RoomInventory;
use App\Models\Booking;
use App\Models\BookingRoom;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Sample Hotel
        $hotel = Hotel::create([
            'name'        => 'Grand Plaza',
            'description' => 'A luxury city center hotel.',
            'address'     => '123 Main Road',
            'city'        => 'Patna',
            'state'       => 'Bihar',
            'country'     => 'India',
            'pincode'     => '800001',
            'phone'       => '0612-5555555',
            'email'       => 'grand@plaza.com',
            'website'     => 'https://grandplaza.com',
            'check_in_time'  => '12:00:00',
            'check_out_time' => '11:00:00',
            'status'         => 'active',
        ]);

        // 2. Sample Guests


        // 3. Sample Rooms
        $room1 = Room::create([
            'hotel_id'    => $hotel->id,
            'name'        => 'Deluxe Room',
            'description' => 'Spacious room with AC and TV.',
            'max_guests'  => 2,
            'base_price'  => 2500.00,
            'status'      => 'available',
        ]);
        $room2 = Room::create([
            'hotel_id'    => $hotel->id,
            'name'        => 'Super Deluxe',
            'description' => 'Includes balcony and bathtub.',
            'max_guests'  => 3,
            'base_price'  => 3500.00,
            'status'      => 'available',
        ]);

        // 4. Room Inventory
        $inventory1 = RoomInventory::create([
            'hotel_id' => 1,
            'room_id'      => $room1->id,
            'room_number'  => '101',
            'floor_number' => '1',
            'status'       => 'available',
        ]);
        $inventory2 = RoomInventory::create([
            'hotel_id' => 1,
            'room_id'      => $room2->id,
            'room_number'  => '201',
            'floor_number' => '2',
            'status'       => 'available',
        ]);

        // 5. Bookings
        $booking1 = Booking::create([
            'hotel_id'        => $hotel->id,
            'guest_id'        => 1,
            'booking_number'  => strtoupper(Str::random(8)),
            'check_in_date'   => now()->toDateString(),
            'check_out_date'  => now()->addDay()->toDateString(),
            'total_guests'    => 2,
            'total_amount'    => 2500.00,
            'discount'        => 0,
            'tax_amount'      => 150.00,
            'grand_total'     => 2650.00,
            'status'          => 'confirmed',
            'payment_status'  => 'paid',
        ]);

        $booking2 = Booking::create([
            'hotel_id'        => $hotel->id,
            'guest_id'        => 2,
            'booking_number'  => strtoupper(Str::random(8)),
            'check_in_date'   => now()->addDays(2)->toDateString(),
            'check_out_date'  => now()->addDays(4)->toDateString(),
            'total_guests'    => 3,
            'total_amount'    => 3500.00,
            'discount'        => 200.00,
            'tax_amount'      => 200.00,
            'grand_total'     => 3500.00,
            'status'          => 'pending',
            'payment_status'  => 'pending',
        ]);

        // 6. Booking Rooms (pivot room assignment for each booking)
        BookingRoom::create([
            'hotel_id' => 1,
            'booking_id'         => $booking1->id,
            'room_inventory_id'  => $inventory1->id,
            'guests_count'       => 2,
            'price_per_night'    => 2500.00,
            'nights'             => 1,
            'subtotal'           => 2500.00,
        ]);
        BookingRoom::create([
            'hotel_id' => 1,
            'booking_id'         => $booking2->id,
            'room_inventory_id'  => $inventory2->id,
            'guests_count'       => 3,
            'price_per_night'    => 1750.00,
            'nights'             => 2,
            'subtotal'           => 3500.00,
        ]);
    }
}
