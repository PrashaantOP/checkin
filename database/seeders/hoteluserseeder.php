<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class hoteluserseeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('hotel_users')->insert([
            'hotel_id' => 1,
            'user_id' => 1,
            'role' => 'admin',
            'status' => 1,
        ]);
    }
}
