<?php
declare(strict_types=1);

namespace App\Models;

use App\Enums\InvoiceStatus; 
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invoice extends Model
{
    use HasFactory, SoftDeletes; 

    protected $fillable = [
        'invoice_number', 
        'client_name', 
        'client_email', 
        'status', 
        'subtotal', 
        'tax_rate', 
        'tax_amount', 
        'total', 
        'due_date', 
        'notes', 
        'issued_at', 
        'paid_at' 
    ]; 

    protected $casts = [
        'status' => InvoiceStatus::class, 
        'due_date' => 'date', 
        'issued_at' => 'datetime', 
        'paid_at' => 'datetime', 
        'tax_rate' => 'decimal:2', 
    ]; 

    protected $with = ['items'];

    public function user():BelongsTo
    {
        return $this->belongsTo(User::class); 
    }

    public function items(): HasMany 
    {
        return $this->hasMany(InvoiceItem::class); 
    }

}
