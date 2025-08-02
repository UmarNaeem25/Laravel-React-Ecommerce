<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Result;
use App\Models\Question;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    public function index()
    {
        $questions = Question::paginate(6);
        return response()->json($questions);
    }

    public function getResults(Request $request)
    {   
        $userId = $request->user_id;

        $results = Result::with('question')
            ->where('user_id', $userId)
            ->paginate(6);

        $totalScore = Result::where('user_id', $userId)->sum('marks');
        $totalQuestions = Result::where('user_id', $userId)->count();
  
        return response()->json([
            'results' => $results,
            'totalScore' => $totalScore,
            'totalQuestions' => $totalQuestions,
        ]);
    }

    public function submit(Request $request)
    {  
        $userId = $request->input('user_id');
        $answers = $request->input('answers', []);

        $questionIds = array_keys($answers);
        $questions = Question::whereIn('id', $questionIds)->get()->keyBy('id')->toArray();

        $score = 0;
        $total = count($questionIds);

        Result::where('user_id' , $userId)->delete();

        foreach ($answers as $questionId => $markedOption) {
            $question = $questions[$questionId];

            if ($question) {
                $markedOption = strtoupper($markedOption);
                $isCorrect = $markedOption === strtoupper($question['correct']);
                $marks = $isCorrect ? 1 : 0;
                $score += $marks;

                Result::create([
                    'user_id'       => $userId,
                    'question_id'   => $questionId,
                    'marks'         => $marks,
                    'marked_option' => $markedOption,
                ]);
            }
        }

        return response()->json([
            'message' => 'Quiz submitted and results stored successfully.',
            'score'   => $score,
            'total'   => $total,
        ]);
    }

        

}
