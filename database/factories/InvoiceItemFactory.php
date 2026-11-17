<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Invoice;
use Illuminate\Database\Eloquent\Factories\Factory;

final class InvoiceItemFactory extends Factory
{
    private static array $descriptions = [
        'Website design and development',
        'Logo and brand identity',
        'SEO audit and optimization',
        'Monthly hosting',
        'Content writing',
        'Social media management',
        'Email campaign setup',
        'UI/UX consultation',
        'Database migration',
        'API integration',
        'Performance optimization',
        'Security audit',
        'Staff training session',
        'Technical support (hourly)',
        'Domain registration',
    ];

    public function definition(): array
    {
        $unitPrice = fake()->numberBetween(500, 25000);
        $quantity = fake()->numberBetween(1, 10);

        return [
            'invoice_id' => Invoice::factory(),
            'description' => fake()->randomElement(self::$descriptions),
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'amount' => $unitPrice * $quantity,
        ];
    }
}
