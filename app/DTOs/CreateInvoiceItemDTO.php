<?php 

declare(strict_types=1); 

namespace App\DTOs; 

final readonly class CreateInvoiceItemDTO
{
    public function __construct(
        public string $description, 
        public int $quantity, 
        public int $unitPrice, 
    ) {} 

    public static function fromArray(array $data): self 
    {
        return new self(
            description: $data['description'], 
            quantity: (int) $data['quantity'], 
            unitPrice: (int) round($data['unit_price'] * 100), 
        ); 
    }
}