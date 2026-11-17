<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Contracts\PdfGeneratorInterface;
use App\Models\PdfExport;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

final class GenerateInvoicePdf implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 10;

    public function __construct(
        public readonly PdfExport $export,
    ) {}

    public function handle(PdfGeneratorInterface $generator): void
    {
        $invoice = $this->export->invoice;

        $pdf = $generator->generate($invoice);

        $path = "invoices/pdf/{$invoice->invoice_number}.pdf";
        Storage::disk('local')->put($path, $pdf);

        $this->export->update([
            'status' => 'completed',
            'path' => $path,
        ]);
    }

    public function failed(\Throwable $exception): void
    {
        $this->export->update([
            'status' => 'failed',
            'error' => $exception->getMessage(),
        ]);
    }
}
