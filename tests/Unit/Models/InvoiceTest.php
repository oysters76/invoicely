<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class InvoiceTest extends TestCase
{
    use RefreshDatabase;

    private function createInvoice(array $attributes = []): Invoice
    {
        $user = User::factory()->create();

        return Invoice::create(array_merge([
            'user_id' => $user->id,
            'client_name' => 'Test Client',
            'client_email' => 'client@test.com',
            'status' => InvoiceStatus::Draft,
            'subtotal' => 10000,
            'tax_rate' => 10,
            'tax_amount' => 1000,
            'total' => 11000,
            'due_date' => now()->addDays(30),
        ], $attributes));
    }

    public function test_invoice_number_is_generated_on_create(): void
    {
        $invoice = $this->createInvoice();
        $this->assertMatchesRegularExpression('/^INV-\d{4}-\d{5}$/', $invoice->invoice_number);
    }

    public function test_invoice_numbers_increment_sequentially(): void
    {
        $first = $this->createInvoice();
        $second = $this->createInvoice();

        $firstSeq = (int) substr($first->invoice_number, -5);
        $secondSeq = (int) substr($second->invoice_number, -5);

        $this->assertSame($firstSeq + 1, $secondSeq);
    }

    public function test_formatted_total_converts_cents_to_currency(): void
    {
        $invoice = $this->createInvoice(['total' => 12345]);
        $this->assertSame('$123.45', $invoice->formatted_total);
    }

    public function test_formatted_subtotal_converts_cents_to_currency(): void
    {
        $invoice = $this->createInvoice(['subtotal' => 50000]);
        $this->assertSame('$500.00', $invoice->formatted_subtotal);
    }

    public function test_status_badge_returns_label_and_color(): void
    {
        $invoice = $this->createInvoice(['status' => InvoiceStatus::Paid]);
        $badge = $invoice->status_badge;

        $this->assertSame('Paid', $badge['label']);
        $this->assertSame('green', $badge['color']);
    }

    public function test_scope_for_user_filters_by_user(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        Invoice::create([
            'user_id' => $user->id,
            'client_name' => 'Mine',
            'client_email' => 'a@a.com',
            'status' => InvoiceStatus::Draft,
            'subtotal' => 100, 'tax_rate' => 0, 'tax_amount' => 0, 'total' => 100,
            'due_date' => now()->addDays(30),
        ]);

        Invoice::create([
            'user_id' => $other->id,
            'client_name' => 'Theirs',
            'client_email' => 'b@b.com',
            'status' => InvoiceStatus::Draft,
            'subtotal' => 100, 'tax_rate' => 0, 'tax_amount' => 0, 'total' => 100,
            'due_date' => now()->addDays(30),
        ]);

        $results = Invoice::forUser($user->id)->get();
        $this->assertCount(1, $results);
        $this->assertSame('Mine', $results->first()->client_name);
    }

    public function test_scope_overdue_finds_sent_past_due(): void
    {
        $user = User::factory()->create();

        Invoice::create([
            'user_id' => $user->id,
            'client_name' => 'Overdue Client',
            'client_email' => 'c@c.com',
            'status' => InvoiceStatus::Sent,
            'subtotal' => 100, 'tax_rate' => 0, 'tax_amount' => 0, 'total' => 100,
            'due_date' => now()->subDays(5),
        ]);

        Invoice::create([
            'user_id' => $user->id,
            'client_name' => 'Future Client',
            'client_email' => 'd@d.com',
            'status' => InvoiceStatus::Sent,
            'subtotal' => 100, 'tax_rate' => 0, 'tax_amount' => 0, 'total' => 100,
            'due_date' => now()->addDays(30),
        ]);

        $results = Invoice::overdue()->get();
        $this->assertCount(1, $results);
        $this->assertSame('Overdue Client', $results->first()->client_name);
    }

    public function test_soft_delete_does_not_remove_from_database(): void
    {
        $invoice = $this->createInvoice();
        $invoice->delete();

        $this->assertSoftDeleted('invoices', ['id' => $invoice->id]);
    }
}
