<?php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ServerFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => ucfirst($this->faker->domainWord()) . '-' . $this->faker->unique()->numberBetween(1, 10000),
            'ip_address' => $this->faker->unique()->ipv4(),
            'provider' => $this->faker->randomElement(['aws','digitalocean','vultr','other']),
            'status' => $this->faker->randomElement(['active','inactive','maintenance']),
            'cpu_cores' => $this->faker->numberBetween(1, 32),
            'ram_mb' => $this->faker->numberBetween(512, 65536),
            'storage_gb' => $this->faker->numberBetween(20, 2000),
            'version' => 1,
        ];
    }
}
