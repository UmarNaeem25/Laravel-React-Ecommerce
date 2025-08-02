<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Controllers\API\CouponController;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user_id;
        $sessionId = session()->getId();

        $filter = $userId ? ['user_id' => $userId] : ['session_id' => $sessionId];

        $cartItems = Cart::with('product')->where($filter)->get();
    
        return response()->json([
            'success' => true,
            'cart' => $cartItems
        ]);
    }

    public function cartCount(Request $request){

        $userId = $request->user_id;

        $count = 0 ;

        if($userId){
            $count = Cart::where('user_id' , $userId)->count();
        }

        return response()->json([
            'success' => true,
            'count' => $count
        ]);

    }

    public function add(Request $request)
    {
        $userId = $request->user_id;
        $sessionId = session()->getId();

        $filter = ['product_id' => $request->product_id];
        if ($userId) {
            $filter['user_id'] = $userId;
        } else {
            $filter['session_id'] = $sessionId;
        }

        $cartItem = Cart::where($filter)->first();

        if ($cartItem) {
            return response()->json([
                'success' => false,
                'message' => 'Product already in cart.'
            ]);
        }

        $cartItem = Cart::create(array_merge($filter, ['quantity' => $request->quantity]));

        return response()->json([
            'success' => true,
            'message' => 'Product added to cart',
            'item'    => $cartItem
        ]);
    }

    public function updateQuantity(Request $request)
    {   
     
        $userId = $request->input('user_id');
        $sessionId = session()->getId();

        $query = Cart::where('product_id', $request->product_id);

        if ($userId) {
            $query->where('user_id', $userId);
        } else {
            $query->where('session_id', $sessionId);
        }

        $cartItem = $query->first();

        if (!$cartItem) {
            return response()->json([
                'success' => false,
                'message' => 'Item not found in cart for this user/session.'
            ], 404);
        }

        $cartItem->quantity = $request->quantity;
        $cartItem->save();

        $couponRemoved = false;
   
        if ($request->has('coupon')) {
            $request->merge(['coupon' => $request->coupon, 'user_id' => $userId]);
            $couponRemoved = CouponController::revalidateCoupon($request);
        }

        return response()->json([
            'success' => true,
            'message' => 'Quantity updated successfully',
            'item'    => $cartItem,
            'coupon_removed' => $couponRemoved
        ]);
    }


    public function remove(Request $request)
    {
        $userId = $request->user_id;
        $sessionId = session()->getId();

        if ($request->has('product_ids')) {
        
            $query = Cart::whereIn('product_id', $request->product_ids);
        }
        elseif ($request->has('product_id')) {
           
            $query = Cart::where('product_id', $request->product_id);
        }
        else {
            return response()->json([
                'success' => false,
                'message' => 'No product ID(s) provided.',
            ], 400);
        }

        if ($userId) {
            $query->where('user_id', $userId);
        } else {
            $query->where('session_id', $sessionId);
        }

        $deleted = $query->delete();

        $couponRemoved = false;

        if ($request->has('coupon')) {
            $request->merge(['coupon' => $request->coupon, 'user_id' => $userId]);

            if (!CouponController::revalidateCoupon($request)) {
                $couponRemoved = true;
            }
        }

        return response()->json([
            'success' => (bool) $deleted,
            'message' => $deleted ? 'Item(s) removed' : 'Item(s) not found',
            'coupon_removed' => $couponRemoved
        ]);
    }

}
