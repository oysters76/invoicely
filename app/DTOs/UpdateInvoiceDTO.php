<?php

declare(strict_types=1);

namespace App\DTOs;

use Carbon\Carbon;

final readonly class UpdateInvoiceDTO
{
    public function __construct(
        public string $clientName,
        public string $clientEmail,
        public Carbon $dueDate,
        public float $taxRate,
        public ?string $notes,
        /** @var CreateInvoiceItemDTO[] */
        public array $items,
    ) {}

    public static function fromRequest(array $validated): self
    {
        return new self(
            clientName: $validated['client_name'],
            clientEmail: $validated['client_email'],
            dueDate: Carbon::parse($validated['due_date']),
            taxRate: (float) $validated['tax_rate'],
            notes: $validated['notes'] ?? null,
            items: array_map(
                fn(array $item) => CreateInvoiceItemDTO::fromArray($item),
                $validated['items'],
            ),
        );
    }
}
