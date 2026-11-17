<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\InvoiceRepositoryInterface;
use App\Contracts\InvoiceServiceInterface;
use App\DTOs\CreateInvoiceDTO;
use App\DTOs\UpdateInvoiceDTO;
use App\Enums\InvoiceStatus;
use App\Exceptions\InvalidStatusTransitionException;
use App\Models\Invoice;
use App\Models\User;

final class InvoiceService implements InvoiceServiceInterface
{
    public function __construct(
        private readonly InvoiceRepositoryInterface $repository,
    ) {}

    public function createInvoice(CreateInvoiceDTO $dto, User $user): Invoice
    {
        $subtotal = 0;
        foreach ($dto->items as $item) {
            $subtotal += $item->quantity * $item->unitPrice;
        }

        $taxAmount = (int) round($subtotal * ($dto->taxRate / 100));
        $total = $subtotal + $taxAmount;

        $invoice = $this->repository->create([
            'user_id' => $user->id,
            'client_name' => $dto->clientName,
            'client_email' => $dto->clientEmail,
            'status' => InvoiceStatus::Draft,
            'subtotal' => $subtotal,
            'tax_rate' => $dto->taxRate,
            'tax_amount' => $taxAmount,
            'total' => $total,
            'due_date' => $dto->dueDate,
            'notes' => $dto->notes,
        ]);

        foreach ($dto->items as $item) {
            $invoice->items()->create([
                'description' => $item->description,
                'quantity' => $item->quantity,
                'unit_price' => $item->unitPrice,
                'amount' => $item->quantity * $item->unitPrice,
            ]);
        }

        return $invoice->fresh('items');
    }

    public function updateInvoice(UpdateInvoiceDTO $dto, Invoice $invoice): Invoice
    {
        $subtotal = 0;
        foreach ($dto->items as $item) {
            $subtotal += $item->quantity * $item->unitPrice;
        }

        $taxAmount = (int) round($subtotal * ($dto->taxRate / 100));
        $total = $subtotal + $taxAmount;

        $invoice = $this->repository->update($invoice, [
            'client_name' => $dto->clientName,
            'client_email' => $dto->clientEmail,
            'subtotal' => $subtotal,
            'tax_rate' => $dto->taxRate,
            'tax_amount' => $taxAmount,
            'total' => $total,
            'due_date' => $dto->dueDate,
            'notes' => $dto->notes,
        ]);

        $invoice->items()->delete();
        foreach ($dto->items as $item) {
            $invoice->items()->create([
                'description' => $item->description,
                'quantity' => $item->quantity,
                'unit_price' => $item->unitPrice,
                'amount' => $item->quantity * $item->unitPrice,
            ]);
        }

        return $invoice->fresh('items');
    }

    public function transitionStatus(Invoice $invoice, InvoiceStatus $newStatus): Invoice
    {
        if (!$invoice->status->canTransitionTo($newStatus)) {
            throw new InvalidStatusTransitionException(
                $invoice->status, $newStatus
            );
        }

        $data = ['status' => $newStatus];

        if ($newStatus === InvoiceStatus::Sent) {
            $data['issued_at'] = now();
        }

        if ($newStatus === InvoiceStatus::Paid) {
            $data['paid_at'] = now();
        }

        if ($newStatus === InvoiceStatus::Cancelled) {
            $data['cancelled_at'] = now();
        }

        return $this->repository->update($invoice, $data);
    }

    public function deleteInvoice(Invoice $invoice): void
    {
        $this->repository->delete($invoice);
    }
}
