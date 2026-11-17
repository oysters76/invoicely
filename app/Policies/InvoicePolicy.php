<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\User;

final class InvoicePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Invoice $invoice): bool
    {
        return $user->id === $invoice->user_id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Invoice $invoice): bool
    {
        return $user->id === $invoice->user_id
            && $invoice->status === InvoiceStatus::Draft;
    }

    public function delete(User $user, Invoice $invoice): bool
    {
        return $user->id === $invoice->user_id
            && $invoice->status === InvoiceStatus::Draft;
    }

    public function markAsPaid(User $user, Invoice $invoice): bool
    {
        return $user->id === $invoice->user_id
            && $invoice->status->canTransitionTo(InvoiceStatus::Paid);
    }

    public function send(User $user, Invoice $invoice): bool
    {
        return $user->id === $invoice->user_id
            && $invoice->status->canTransitionTo(InvoiceStatus::Sent);
    }

    public function cancel(User $user, Invoice $invoice): bool
    {
        return $user->id === $invoice->user_id
            && $invoice->status->canTransitionTo(InvoiceStatus::Cancelled);
    }
}
