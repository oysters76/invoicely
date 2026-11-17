<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\InvoiceStatus;
use Illuminate\Database\Eloquent\Attributes\Attribute;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute as CastAttribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Number;

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
        'paid_at',
    ];

    protected $casts = [
        'status' => InvoiceStatus::class,
        'due_date' => 'date',
        'issued_at' => 'datetime',
        'paid_at' => 'datetime',
        'tax_rate' => 'decimal:2',
    ];

    protected $with = ['items'];

    protected $appends = [
        'formatted_total',
        'formatted_subtotal',
        'formatted_tax_amount',
        'formatted_date',
        'status_badge',
    ];

    // ── Model Event: auto-generate invoice number ──

    protected static function booted(): void
    {
        static::creating(function (Invoice $invoice) {
            $invoice->invoice_number = self::generateInvoiceNumber();
        });
    }

    private static function generateInvoiceNumber(): string
    {
        $year = now()->year;
        $latest = static::whereYear('created_at', $year)
            ->max('invoice_number');

        $sequence = $latest
            ? (int) substr($latest, -5) + 1
            : 1;

        return sprintf('INV-%d-%05d', $year, $sequence);
    }

    // ── Relationships ──

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }

    // ── Query Scopes ──

    public function scopeForUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    public function scopeDraft(Builder $query): Builder
    {
        return $query->where('status', InvoiceStatus::Draft);
    }

    public function scopeSent(Builder $query): Builder
    {
        return $query->where('status', InvoiceStatus::Sent);
    }

    public function scopePaid(Builder $query): Builder
    {
        return $query->where('status', InvoiceStatus::Paid);
    }

    public function scopeOverdue(Builder $query): Builder
    {
        return $query->where('status', InvoiceStatus::Sent)
            ->where('due_date', '<', now());
    }

    public function scopeUnpaid(Builder $query): Builder
    {
        return $query->whereNotIn('status', [
            InvoiceStatus::Paid,
            InvoiceStatus::Cancelled,
        ]);
    }

    // ── Accessors ──

    protected function formattedTotal(): CastAttribute
    {
        return CastAttribute::make(
            get: fn () => Number::currency($this->total / 100),
        );
    }

    protected function formattedSubtotal(): CastAttribute
    {
        return CastAttribute::make(
            get: fn () => Number::currency($this->subtotal / 100),
        );
    }

    protected function formattedTaxAmount(): CastAttribute
    {
        return CastAttribute::make(
            get: fn () => Number::currency($this->tax_amount / 100),
        );
    }

    protected function formattedDate(): CastAttribute
    {
        return CastAttribute::make(
            get: fn () => $this->created_at?->format('M d, Y'),
        );
    }

    protected function statusBadge(): CastAttribute
    {
        return CastAttribute::make(
            get: fn () => [
                'label' => $this->status->label(),
                'color' => $this->status->color(),
            ],
        );
    }
}
