<?php
namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use DB;

class SettingController extends Controller
{
    public function getCurrencies(Request $request){

        $currencies = DB::table('currencies')->select('id' , 'symbol' , 'rate')->get();

        return response()->json([
            'currencies' => $currencies
        ]);
    }

    public function CurrencyConvert(Request $request)
    {
        $currency = DB::table('currencies')->where('symbol', $request->symbol)->first();

        if ($currency) {
            return response()->json([
                'symbol' => $currency->symbol,
                'rate' => $currency->rate
            ]);
        } else {
            return response()->json([
                'error' => 'Currency not found'
            ], 404);
        }
    }

}
