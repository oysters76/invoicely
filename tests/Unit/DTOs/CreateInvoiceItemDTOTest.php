<?php

declare(strict_types=1);

namespace Tests\Unit\DTOs;

use App\DTOs\CreateInvoiceItemDTO;
use PHPUnit\Framework\TestCase;

final class CreateInvoiceItemDTOTest extends TestCase
{
    public function test_from_array_converts_dollars_to_cents(): void
    {
        $dto = CreateInvoiceItemDTO::fromArray([
            'description' => 'Consulting',
            'quantity' => 5,
            'unit_price' => 75.50,
        ]);

        $this->assertSame('Consulting', $dto->description);
        $this->assertSame(5, $dto->quantity);
        $this->assertSame(7550, $dto->unitPrice);
    }

    public function test_from_array_handles_whole_dollar_amounts(): void
    {
        $dto = CreateInvoiceItemDTO::fromArray([
            'description' => 'Flat fee',
            'quantity' => 1,
            'unit_price' => 200.00,
        ]);

        $this->assertSame(20000, $dto->unitPrice);
    }

    public function test_from_array_handles_fractional_cents(): void
    {
        $dto = CreateInvoiceItemDTO::fromArray([
            'description' => 'Per-unit fee',
            'quantity' => 100,
            'unit_price' => 0.995,
        ]);

        $this->assertSame(100, $dto->unitPrice);
    }
}
