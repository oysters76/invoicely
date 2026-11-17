<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\CreateInvoiceAction;
use App\Actions\DeleteInvoiceAction;
use App\Actions\MarkAsPaidAction;
use App\Actions\UpdateInvoiceAction;
use App\Contracts\InvoiceRepositoryInterface;
use App\DTOs\CreateInvoiceDTO;
use App\DTOs\UpdateInvoiceDTO;
use App\Enums\InvoiceStatus;
use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use App\Models\Invoice;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class InvoiceController extends Controller
{
    public function __construct(
        private readonly InvoiceRepositoryInterface $repository,
    ) {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['status']);

        $invoices = $this->repository->getAllForUser(
            $request->user()->id,
            $filters,
        );

        $stats = $this->repository->getDashboardStats($request->user()->id);

        return Inertia::render('Invoices/Index', [
            'invoices' => $invoices,
            'stats' => $stats,
            'filters' => $filters,
            'statuses' => InvoiceStatus::cases(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Invoices/Create');
    }

    public function store(
        StoreInvoiceRequest $request,
        CreateInvoiceAction $action,
    ): RedirectResponse {
        $dto = CreateInvoiceDTO::fromRequest($request->validated());
        $invoice = $action($dto, $request->user());

        return redirect()
            ->route('invoices.show', $invoice)
            ->with('success', 'Invoice created successfully.');
    }

    public function show(Invoice $invoice): Response
    {
        $this->authorize('view', $invoice);

        return Inertia::render('Invoices/Show', [
            'invoice' => $invoice,
        ]);
    }

    public function edit(Invoice $invoice): Response
    {
        $this->authorize('update', $invoice);

        return Inertia::render('Invoices/Edit', [
            'invoice' => $invoice,
        ]);
    }

    public function update(
        UpdateInvoiceRequest $request,
        Invoice $invoice,
        UpdateInvoiceAction $action,
    ): RedirectResponse {
        $this->authorize('update', $invoice);

        $dto = UpdateInvoiceDTO::fromRequest($request->validated());
        $action($dto, $invoice);

        return redirect()
            ->route('invoices.show', $invoice)
            ->with('success', 'Invoice updated successfully.');
    }

    public function destroy(
        Invoice $invoice,
        DeleteInvoiceAction $action,
    ): RedirectResponse {
        $this->authorize('delete', $invoice);

        $action($invoice);

        return redirect()
            ->route('invoices.index')
            ->with('success', 'Invoice deleted successfully.');
    }

    public function markAsPaid(
        Invoice $invoice,
        MarkAsPaidAction $action,
    ): RedirectResponse {
        $this->authorize('markAsPaid', $invoice);

        $action($invoice);

        return redirect()
            ->route('invoices.show', $invoice)
            ->with('success', 'Invoice marked as paid.');
    }

    public function send(Invoice $invoice): RedirectResponse
    {
        $this->authorize('send', $invoice);

        $invoice->update([
            'status' => InvoiceStatus::Sent,
            'issued_at' => now(),
        ]);

        return redirect()
            ->route('invoices.show', $invoice)
            ->with('success', 'Invoice sent successfully.');
    }
}
