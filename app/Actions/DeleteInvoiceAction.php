<?php

declare(strict_types=1);

namespace App\Actions;

use App\Contracts\InvoiceServiceInterface;
use App\Models\Invoice;

final class DeleteInvoiceAction
{
    public function __construct(
        private readonly InvoiceServiceInterface $service,
    ) {}

    public function __invoke(Invoice $invoice): void
    {
        $this->service->deleteInvoice($invoice);
    }
}
