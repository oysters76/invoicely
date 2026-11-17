<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Models\Invoice;

interface PdfGeneratorInterface
{
    public function generate(Invoice $invoice): string;
}
