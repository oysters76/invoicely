<?php

declare(strict_types=1);

namespace Tests\Feature\Invoice;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class InvoiceCrudTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    private function validInvoiceData(array $overrides = []): array
    {
        return array_merge([
            'client_name' => 'Acme Corp',
            'client_email' => 'billing@acme.com',
            'due_date' => now()->addDays(30)->format('Y-m-d'),
            'tax_rate' => 10,
            'notes' => null,
            'items' => [
                ['description' => 'Web design', 'quantity' => 2, 'unit_price' => 150.00],
            ],
        ], $overrides);
    }

    public function test_guest_cannot_access_invoices(): void
    {
        $this->get(route('invoices.index'))->assertRedirect(route('login'));
    }

    public function test_user_can_view_invoice_list(): void
    {
        $this->actingAs($this->user)
            ->get(route('invoices.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Invoices/Index'));
    }

    public function test_user_can_create_invoice(): void
    {
        $response = $this->actingAs($this->user)
            ->post(route('invoices.store'), $this->validInvoiceData());

        $response->assertRedirect();

        $this->assertDatabaseHas('invoices', [
            'user_id' => $this->user->id,
            'client_name' => 'Acme Corp',
            'client_email' => 'billing@acme.com',
            'status' => InvoiceStatus::Draft->value,
        ]);

        $this->assertDatabaseHas('invoice_items', [
            'description' => 'Web design',
            'quantity' => 2,
            'unit_price' => 15000,
        ]);
    }

    public function test_invoice_number_is_auto_generated(): void
    {
        $this->actingAs($this->user)
            ->post(route('invoices.store'), $this->validInvoiceData());

        $invoice = Invoice::first();
        $this->assertMatchesRegularExpression('/^INV-\d{4}-\d{5}$/', $invoice->invoice_number);
    }

    public function test_invoice_calculates_totals_correctly(): void
    {
        $this->actingAs($this->user)
            ->post(route('invoices.store'), $this->validInvoiceData([
                'tax_rate' => 10,
                'items' => [
                    ['description' => 'Item A', 'quantity' => 2, 'unit_price' => 100.00],
                    ['description' => 'Item B', 'quantity' => 1, 'unit_price' => 50.00],
                ],
            ]));

        $invoice = Invoice::first();
        $this->assertSame(25000, $invoice->subtotal);
        $this->assertSame(2500, $invoice->tax_amount);
        $this->assertSame(27500, $invoice->total);
    }

    public function test_user_can_view_own_invoice(): void
    {
        $this->actingAs($this->user)
            ->post(route('invoices.store'), $this->validInvoiceData());

        $invoice = Invoice::first();

        $this->actingAs($this->user)
            ->get(route('invoices.show', $invoice))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Invoices/Show'));
    }

    public function test_user_cannot_view_others_invoice(): void
    {
        $this->actingAs($this->user)
            ->post(route('invoices.store'), $this->validInvoiceData());

        $invoice = Invoice::first();
        $otherUser = User::factory()->create();

        $this->actingAs($otherUser)
            ->get(route('invoices.show', $invoice))
            ->assertForbidden();
    }

    public function test_user_can_update_draft_invoice(): void
    {
        $this->actingAs($this->user)
            ->post(route('invoices.store'), $this->validInvoiceData());

        $invoice = Invoice::first();

        $this->actingAs($this->user)
            ->put(route('invoices.update', $invoice), $this->validInvoiceData([
                'client_name' => 'Updated Corp',
            ]))
            ->assertRedirect();

        $this->assertDatabaseHas('invoices', [
            'id' => $invoice->id,
            'client_name' => 'Updated Corp',
        ]);
    }

    public function test_user_can_delete_draft_invoice(): void
    {
        $this->actingAs($this->user)
            ->post(route('invoices.store'), $this->validInvoiceData());

        $invoice = Invoice::first();

        $this->actingAs($this->user)
            ->delete(route('invoices.destroy', $invoice))
            ->assertRedirect(route('invoices.index'));

        $this->assertSoftDeleted('invoices', ['id' => $invoice->id]);
    }

    public function test_user_can_send_draft_invoice(): void
    {
        $this->actingAs($this->user)
            ->post(route('invoices.store'), $this->validInvoiceData());

        $invoice = Invoice::first();

        $this->actingAs($this->user)
            ->patch(route('invoices.send', $invoice))
            ->assertRedirect();

        $invoice->refresh();
        $this->assertSame(InvoiceStatus::Sent, $invoice->status);
        $this->assertNotNull($invoice->issued_at);
    }

    public function test_user_can_mark_sent_invoice_as_paid(): void
    {
        $this->actingAs($this->user)
            ->post(route('invoices.store'), $this->validInvoiceData());

        $invoice = Invoice::first();
        $invoice->update(['status' => InvoiceStatus::Sent, 'issued_at' => now()]);

        $this->actingAs($this->user)
            ->patch(route('invoices.mark-paid', $invoice))
            ->assertRedirect();

        $invoice->refresh();
        $this->assertSame(InvoiceStatus::Paid, $invoice->status);
        $this->assertNotNull($invoice->paid_at);
    }

    public function test_cannot_edit_sent_invoice(): void
    {
        $this->actingAs($this->user)
            ->post(route('invoices.store'), $this->validInvoiceData());

        $invoice = Invoice::first();
        $invoice->update(['status' => InvoiceStatus::Sent, 'issued_at' => now()]);

        $this->actingAs($this->user)
            ->put(route('invoices.update', $invoice), $this->validInvoiceData())
            ->assertForbidden();
    }

    public function test_cannot_delete_sent_invoice(): void
    {
        $this->actingAs($this->user)
            ->post(route('invoices.store'), $this->validInvoiceData());

        $invoice = Invoice::first();
        $invoice->update(['status' => InvoiceStatus::Sent, 'issued_at' => now()]);

        $this->actingAs($this->user)
            ->delete(route('invoices.destroy', $invoice))
            ->assertForbidden();
    }

    public function test_store_validates_required_fields(): void
    {
        $this->actingAs($this->user)
            ->post(route('invoices.store'), [])
            ->assertSessionHasErrors(['client_name', 'client_email', 'due_date', 'tax_rate', 'items']);
    }

    public function test_store_validates_items_array(): void
    {
        $this->actingAs($this->user)
            ->post(route('invoices.store'), $this->validInvoiceData([
                'items' => [],
            ]))
            ->assertSessionHasErrors('items');
    }

    public function test_store_validates_due_date_in_future(): void
    {
        $this->actingAs($this->user)
            ->post(route('invoices.store'), $this->validInvoiceData([
                'due_date' => '2020-01-01',
            ]))
            ->assertSessionHasErrors('due_date');
    }
}
