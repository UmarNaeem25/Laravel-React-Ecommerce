<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Product;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function __construct(...$args)
    {
        parent::__construct(...$args);

        $this->faker = \Faker\Factory::create('en_US');
    }

    public function definition(): array
    {
        return [
            'name' => ucfirst($this->faker->words(2, true)), 
            'description' => $this->faker->sentence(10),
            'price' => $this->faker->randomFloat(2, 10, 500),
            'stock' => $this->faker->numberBetween(0, 100),
            'sku' => strtoupper($this->faker->bothify('SKU-###??')),
            'category' => $this->faker->randomElement(['Electronics', 'Books', 'Clothing', 'Home', 'Beauty']),
        ];
    }
}


