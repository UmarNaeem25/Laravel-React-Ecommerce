<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory; 

class Question extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'question', 'option_a', 'option_b', 'option_c', 'option_d', 'correct'
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'results')
            ->withPivot('marks', 'marked_option');
    }

}
