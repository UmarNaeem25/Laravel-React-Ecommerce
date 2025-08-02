<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use DB;

class ContactController extends Controller
{
    public function inquiry(Request $request)
    {

        DB::table('inquiry')->insert([
            'name'    => $request->name,
            'email'   => $request->email,
            'phone'   => $request->phone,
            'message' => $request->message,
            'created_at' => now(),
        ]);
    
        return response()->json(['message' => 'Inquiry submitted successfully.']);
    
    }
}
