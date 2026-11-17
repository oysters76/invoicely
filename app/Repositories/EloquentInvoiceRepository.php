<?php 

declare(strict_types=1); 

namespace App\Repositories; 

use App\Contracts\InvoiceRepositoryInterface; 
use App\DTOs\InvoiceDashboardDTO; 
use App\Enums\InvoiceStatus; 
use App\Models\Invoice; 
use Illuminate\Pagination\LengthAwarePaginator;
use Override;

final class EloquentInvoiceRepository implements InvoiceRepositoryInterface
{
    #[Override]
    public function findById(int $id): Invoice
    {
        return Invoice::with('items')->findOrFail($id);
    }

    #[Override]
    public function findByIdForUser(int $id, int $userId): Invoice
    {
        return Invoice::where('user_id', $userId)
         ->with('items')
         ->findOrFail($id); 
    }

    #[Override]
    public function getAllForUser(int $userId, array $filters = []): LengthAwarePaginator
    {
        $query = Invoice::where('user_id', $userId); 
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']); 
        }
        return $query->latest()->paginate(10); 
    }

    #[Override]
    public function create(array $data): Invoice
    {
        return Invoice::create($data); 
    }

    #[Override]
    public function update(Invoice $invoice, array $data): Invoice
    {
        $invoice->update($data); 
        return $invoice->fresh('items'); 
    }

    #[Override]
    public function delete(Invoice $invoice): void
    {
        $invoice->delete(); 
    }

    #[Override]
    public function getDashboardStats(int $userId): InvoiceDashboardDTO
    {
        $invoices = Invoice::where('user_id', $userId);

        return new InvoiceDashboardDTO(
            totalCount: $invoices->count(),
            draftCount: (clone $invoices)->where('status', InvoiceStatus::Draft)->count(),
            sentCount: (clone $invoices)->where('status', InvoiceStatus::Sent)->count(),
            paidCount: (clone $invoices)->where('status', InvoiceStatus::Paid)->count(),
            overdueCount: (clone $invoices)->where('status', InvoiceStatus::Overdue)->count(),
            totalAmount: (clone $invoices)->sum('total'),
            paidAmount: (clone $invoices)->where('status', InvoiceStatus::Paid)->sum('total'),
            unpaidAmount: (clone $invoices)->whereNotIn('status', [InvoiceStatus::Paid, InvoiceStatus::Cancelled])->sum('total'),
            overdueAmount: (clone $invoices)->where('status', InvoiceStatus::Overdue)->sum('total'),
        );
    }
}