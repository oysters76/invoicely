<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\InvoiceRepositoryInterface;
use App\Contracts\InvoiceServiceInterface;
use App\Contracts\PdfGeneratorInterface;
use App\Repositories\EloquentInvoiceRepository;
use App\Services\DomPdfInvoiceGenerator;
use App\Services\InvoiceService;
use Illuminate\Support\ServiceProvider;

final class InvoiceServiceProvider extends ServiceProvider
{
    public array $bindings = [
        InvoiceRepositoryInterface::class => EloquentInvoiceRepository::class,
        InvoiceServiceInterface::class => InvoiceService::class,
        PdfGeneratorInterface::class => DomPdfInvoiceGenerator::class,
    ];
}