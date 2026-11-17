<?php

namespace Database\Seeders;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'Demo User',
            'email' => 'demo@invoicely.test',
            'password' => bcrypt('password'),
        ]);

        // 5 draft invoices
        Invoice::factory(5)
            ->for($user)
            ->has(InvoiceItem::factory()->count(rand(1, 4)), 'items')
            ->create();

        // 8 sent invoices
        Invoice::factory(8)
            ->for($user)
            ->sent()
            ->has(InvoiceItem::factory()->count(rand(1, 3)), 'items')
            ->create();

        // 10 paid invoices
        Invoice::factory(10)
            ->for($user)
            ->paid()
            ->has(InvoiceItem::factory()->count(rand(2, 5)), 'items')
            ->create();

        // 3 overdue invoices
        Invoice::factory(3)
            ->for($user)
            ->overdue()
            ->has(InvoiceItem::factory()->count(rand(1, 3)), 'items')
            ->create();

        // 2 cancelled invoices
        Invoice::factory(2)
            ->for($user)
            ->cancelled()
            ->has(InvoiceItem::factory()->count(rand(1, 2)), 'items')
            ->create();
    }
}
