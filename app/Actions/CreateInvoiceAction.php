<?php

declare(strict_types=1);

namespace App\Actions;

use App\Contracts\InvoiceServiceInterface;
use App\DTOs\CreateInvoiceDTO;
use App\Models\Invoice;
use App\Models\User;
use Illuminate\Support\Facades\DB;

final class CreateInvoiceAction
{
    public function __construct(
        private readonly InvoiceServiceInterface $service,
    ) {}

    public function __invoke(CreateInvoiceDTO $dto, User $user): Invoice
    {
        return DB::transaction(function () use ($dto, $user) {
            return $this->service->createInvoice($dto, $user);
        });
    }
}
