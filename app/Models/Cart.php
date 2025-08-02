<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Product;

class Cart extends Model
{
    use HasFactory;

    protected $table = 'carts';

    protected $fillable = [
        'product_id',
        'quantity',
        'user_id',
        'session_id',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
