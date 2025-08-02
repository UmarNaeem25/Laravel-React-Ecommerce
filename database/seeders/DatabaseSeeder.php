<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Question;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            DevelopmentQuestionsSeeder::class,
        ]);
    }

}
