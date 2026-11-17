<?php

declare(strict_types=1);

namespace App\Contracts; 

use App\DTOs\InvoiceDashboardDTO;
use App\Models\Invoice;
use Illuminate\Pagination\LengthAwarePaginator; 

interface InvoiceRepositoryInterface
{
 public function findById(int $id): Invoice; 
 public function findByIdForUser(int $id, int $userId): Invoice; 
 public function getAllForUser(int $userId, array $filters=[]): LengthAwarePaginator; 
 public function create(array $data):Invoice; 
 public function update(Invoice $invoice, array $data): Invoice; 
 public function delete(Invoice $invoice): void;
 public function getDashboardStats(int $userId): InvoiceDashboardDTO;
}