<?php

declare(strict_types=1);

namespace App\Actions;

use App\Contracts\InvoiceServiceInterface;
use App\DTOs\UpdateInvoiceDTO;
use App\Models\Invoice;
use Illuminate\Support\Facades\DB;

final class UpdateInvoiceAction
{
    public function __construct(
        private readonly InvoiceServiceInterface $service,
    ) {}

    public function __invoke(UpdateInvoiceDTO $dto, Invoice $invoice): Invoice
    {
        return DB::transaction(function () use ($dto, $invoice) {
            return $this->service->updateInvoice($dto, $invoice);
        });
    }
}
