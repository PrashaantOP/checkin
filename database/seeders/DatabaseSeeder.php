<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            users::class,
            hotelseeder::class,

            guestseeder::class,
            hoteluserseeder::class,
            BookingSeeder::class,
        ]);
    }
}
