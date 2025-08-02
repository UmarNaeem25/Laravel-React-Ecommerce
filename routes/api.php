<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ContactController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\CartController;
use App\Http\Controllers\API\CouponController;
use App\Http\Controllers\API\QuestionController;
use App\Http\Controllers\API\SettingController;


Route::controller(AuthController::class)->group(function () {
    Route::post('/register', 'register');
    Route::post('/login', 'login');
    Route::middleware('auth:sanctum')->post('/logout', 'logout');
    Route::middleware('auth:sanctum')->get('/protected-test', function () {
        return response()->json([
            'message' => 'Authenticated via Sanctum!',
            'user' => auth()->user(),
        ]);
    });
});

Route::controller(ContactController::class)->group(function () {
    Route::post('/inquiry', 'inquiry');
});

Route::controller(ProductController::class)->group(function () {
    Route::get('/products', 'getProducts');
});

Route::controller(CartController::class)->group(function () {
    Route::get('/cart', 'index');
    Route::get('/cart-count', 'cartCount');
    Route::post('/cart/add', 'add');
    Route::post('/cart/update-quantity', 'updateQuantity');
    Route::post('/cart/remove', 'remove');
});

Route::controller(CouponController::class)->group(function () {
    Route::post('/apply-coupon', 'apply_coupon');
});

Route::controller(QuestionController::class)->group(function () {
    Route::get('/questions', 'index');
    Route::post('/submit-quiz', 'submit');
    Route::get('/results', 'getResults');
});

Route::controller(SettingController::class)->group(function () {
    Route::get('/currencies', 'getCurrencies');
    Route::post('/currency-convert', 'CurrencyConvert');
});
