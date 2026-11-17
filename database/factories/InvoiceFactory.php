<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\InvoiceStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

final class InvoiceFactory extends Factory
{
    public function definition(): array
    {
        $subtotal = fake()->numberBetween(5000, 500000);
        $taxRate = fake()->randomElement([0, 5, 7.5, 10, 15, 20]);
        $taxAmount = (int) round($subtotal * $taxRate / 100);
        $total = $subtotal + $taxAmount;

        return [
            'user_id' => User::factory(),
            'client_name' => fake()->company(),
            'client_email' => fake()->companyEmail(),
            'status' => InvoiceStatus::Draft,
            'subtotal' => $subtotal,
            'tax_rate' => $taxRate,
            'tax_amount' => $taxAmount,
            'total' => $total,
            'due_date' => fake()->dateTimeBetween('+1 week', '+3 months'),
            'notes' => fake()->optional(0.4)->sentence(),
        ];
    }

    public function sent(): static
    {
        return $this->state(fn () => [
            'status' => InvoiceStatus::Sent,
            'issued_at' => fake()->dateTimeBetween('-2 months', '-1 week'),
        ]);
    }

    public function paid(): static
    {
        return $this->state(fn () => [
            'status' => InvoiceStatus::Paid,
            'issued_at' => fake()->dateTimeBetween('-3 months', '-1 month'),
            'paid_at' => fake()->dateTimeBetween('-1 month', 'now'),
        ]);
    }

    public function overdue(): static
    {
        return $this->state(fn () => [
            'status' => InvoiceStatus::Sent,
            'issued_at' => fake()->dateTimeBetween('-3 months', '-2 months'),
            'due_date' => fake()->dateTimeBetween('-1 month', '-1 day'),
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(fn () => [
            'status' => InvoiceStatus::Cancelled,
        ]);
    }
}
