<?php

namespace Database\Factories;

use App\Models\Question;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuestionFactory extends Factory
{
    protected $model = Question::class;

    public function definition()
    {
  
        $options = $this->faker->unique()->words(4);
        shuffle($options); 
        $correctOption = ['a', 'b', 'c', 'd'][rand(0, 3)];

        return [
            'question'   => $this->faker->sentence . '?',
            'option_a'   => $options[0],
            'option_b'   => $options[1],
            'option_c'   => $options[2],
            'option_d'   => $options[3],
            'correct'    => $correctOption,
        ];
    }
}
