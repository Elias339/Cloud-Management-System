<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Server;

class ServerSeeder extends Seeder
{
    public function run(): void
    {
        Server::factory()->count(500)->create();
    }
}
