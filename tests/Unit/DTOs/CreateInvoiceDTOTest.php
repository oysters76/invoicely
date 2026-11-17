<?php

declare(strict_types=1);

namespace Tests\Unit\DTOs;

use App\DTOs\CreateInvoiceDTO;
use App\DTOs\CreateInvoiceItemDTO;
use PHPUnit\Framework\TestCase;

final class CreateInvoiceDTOTest extends TestCase
{
    public function test_from_request_creates_dto(): void
    {
        $data = [
            'client_name' => 'Acme Corp',
            'client_email' => 'billing@acme.com',
            'due_date' => '2026-12-31',
            'tax_rate' => 10,
            'notes' => 'Net 30',
            'items' => [
                ['description' => 'Web design', 'quantity' => 1, 'unit_price' => 150.00],
                ['description' => 'Hosting', 'quantity' => 12, 'unit_price' => 9.99],
            ],
        ];

        $dto = CreateInvoiceDTO::fromRequest($data);

        $this->assertSame('Acme Corp', $dto->clientName);
        $this->assertSame('billing@acme.com', $dto->clientEmail);
        $this->assertSame(10.0, $dto->taxRate);
        $this->assertSame('Net 30', $dto->notes);
        $this->assertCount(2, $dto->items);
        $this->assertInstanceOf(CreateInvoiceItemDTO::class, $dto->items[0]);
    }

    public function test_from_request_handles_null_notes(): void
    {
        $data = [
            'client_name' => 'Test',
            'client_email' => 'test@test.com',
            'due_date' => '2026-12-31',
            'tax_rate' => 0,
            'notes' => null,
            'items' => [
                ['description' => 'Item', 'quantity' => 1, 'unit_price' => 100.00],
            ],
        ];

        $dto = CreateInvoiceDTO::fromRequest($data);

        $this->assertNull($dto->notes);
    }
}
