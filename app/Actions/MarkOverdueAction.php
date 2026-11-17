<?php

declare(strict_types=1);

namespace App\Actions;

use App\Contracts\InvoiceRepositoryInterface;
use App\Contracts\InvoiceServiceInterface;
use App\Enums\InvoiceStatus;
use App\Models\Invoice;

final class MarkOverdueAction
{
    public function __construct(
        private readonly InvoiceServiceInterface $service,
    ) {}

    public function __invoke(): int
    {
        $overdueInvoices = Invoice::where('status', InvoiceStatus::Sent)
            ->where('due_date', '<', now())
            ->get();

        foreach ($overdueInvoices as $invoice) {
            $this->service->transitionStatus($invoice, InvoiceStatus::Overdue);
        }

        return $overdueInvoices->count();
    }
}
