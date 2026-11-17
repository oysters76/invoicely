<?php

declare(strict_types=1);

namespace App\Contracts;

use App\DTOs\CreateInvoiceDTO;
use App\DTOs\UpdateInvoiceDTO;
use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\User;

interface InvoiceServiceInterface
{
    public function createInvoice(CreateInvoiceDTO $dto, User $user): Invoice; 
    public function updateInvoice(UpdateInvoiceDTO $dto, Invoice $invoice): Invoice; 
    public function transitionStatus(Invoice $invoice, InvoiceStatus $newStatus): Invoice; 
    public function deleteInvoice(Invoice $invoice): void; 
}
