<?php

declare(strict_types=1);

namespace App\Actions;

use App\Contracts\InvoiceServiceInterface;
use App\Enums\InvoiceStatus;
use App\Models\Invoice;

final class MarkAsPaidAction
{
    public function __construct(
        private readonly InvoiceServiceInterface $service,
    ) {}

    public function __invoke(Invoice $invoice): Invoice
    {
        return $this->service->transitionStatus($invoice, InvoiceStatus::Paid);
    }
}
