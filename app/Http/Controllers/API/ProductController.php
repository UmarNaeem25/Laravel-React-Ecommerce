<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Cart;

class ProductController extends Controller
{
  
    public function getProducts(Request $request)
    {
        $userId = $request->query('user_id');
        $products = Product::where('stock', '>', 0)->paginate(12);

        $cartProductIds = [];

        if ($userId) {
            $cartProductIds = Cart::where('user_id', $userId)
                ->whereIn('product_id', $products->pluck('id'))
                ->pluck('product_id')
                ->toArray();
        }


        $products->getCollection()->transform(function ($product) use ($cartProductIds) {
            $product->is_added_to_cart = in_array($product->id, $cartProductIds);
            return $product;
        });
    
        return response()->json([
            'current_page' => $products->currentPage(),
            'last_page' => $products->lastPage(),
            'per_page' => $products->perPage(),
            'total' => $products->total(),
            'data' => $products->items(),
        ]);
    }



}
