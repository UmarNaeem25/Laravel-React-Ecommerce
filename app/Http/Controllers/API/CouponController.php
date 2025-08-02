<?php
namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Coupon;
use DB;

class CouponController extends Controller
{
    public function apply_coupon(Request $request)
    {   
        $coupon = Coupon::where('name', $request->coupon)
            ->where('expiry_date', '>', now())
            ->first();

        if (!$coupon) {
            return response()->json([
                'status' => 'error',
                'message' => 'Coupon is either invalid or has expired.'
            ]);
        }

        $userId = $request->user_id;
        $totalAmount = $request->cart_total;
      
        if ($totalAmount < $coupon->minimum_spend) {
            return response()->json([
                'status' => 'error',
                'message' => 'The minimum amount to apply this coupon code is ' . $coupon->minimum_spend
            ]);
        }

        $userUsageCount = DB::table('coupon_user')
            ->where('coupon_id', $coupon->id)
            ->where('user_id', $userId)
            ->count();

        if ($userUsageCount >= $coupon->usage_limit_per_user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Your coupon usage limit has been reached. Please try again later.'
            ]);
        }

       
        return response()->json([
            'status' => 'success',
            'message' => 'Coupon has been applied successfully.',
            'discount' => $coupon->amount,
            'minimum' => $coupon->minimum_spend,
        ]);
    }


    public static function revalidateCoupon(Request $request)
    {
        $couponCode = $request->coupon;
        $userId = $request->user_id;

        $coupon = Coupon::where('name', $couponCode)->first();

        if (!$coupon) {
            return false;
        }        

        if ((float) $request->total < (float) $coupon->minimum_spend) {
            return true;
        }        
        return false;
    }


}
