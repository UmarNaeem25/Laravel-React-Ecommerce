<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Question;

class Result extends Model
{
    protected $table = 'results';

    protected $fillable = [
        'user_id', 'question_id', 'marks', 'marked_option',
    ];
    
    public function question()
    {
        return $this->belongsTo(Question::class, 'question_id');
    }

}
