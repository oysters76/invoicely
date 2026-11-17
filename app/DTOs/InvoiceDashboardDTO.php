<?php

declare(strict_types=1);

namespace App\DTOs;

final readonly class InvoiceDashboardDTO
{
    public function __construct(
        public int $totalCount,
        public int $draftCount,
        public int $sentCount,
        public int $paidCount,
        public int $overdueCount,
        public int $totalAmount,
        public int $paidAmount,
        public int $unpaidAmount,
        public int $overdueAmount,
    ) {}
}
