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
            BookingSeeder::class,
        ]);

        User::factory()->create([
            'name' => 'Prashant Kumar',
            'email' => 'pk1093524@gmail.com',
        ]);
    }
}
