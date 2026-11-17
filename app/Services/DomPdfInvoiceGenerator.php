<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\PdfGeneratorInterface;
use App\Models\Invoice;
use Barryvdh\DomPDF\Facade\Pdf;

final class DomPdfInvoiceGenerator implements PdfGeneratorInterface
{
    public function generate(Invoice $invoice): string
    {
        $pdf = Pdf::loadView('pdf.invoice', [
            'invoice' => $invoice->load('items', 'user'),
        ]);

        return $pdf->output();
    }
}
