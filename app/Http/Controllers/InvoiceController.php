<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\CancelInvoiceAction;
use App\Actions\CreateInvoiceAction;
use App\Actions\DeleteInvoiceAction;
use App\Actions\MarkAsPaidAction;
use App\Actions\SendInvoiceAction;
use App\Actions\UpdateInvoiceAction;
use App\Contracts\InvoiceRepositoryInterface;
use App\Contracts\PdfGeneratorInterface;
use App\DTOs\CreateInvoiceDTO;
use App\DTOs\UpdateInvoiceDTO;
use App\Enums\InvoiceStatus;
use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use App\Jobs\GenerateInvoicePdf;
use App\Models\Invoice;
use App\Models\PdfExport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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

    public function show(Invoice $invoice, Request $request): Response
    {
        $this->authorize('view', $invoice);

        $user = $request->user();

        return Inertia::render('Invoices/Show', [
            'invoice' => $invoice,
            'can' => [
                'edit' => $user->can('update', $invoice),
                'delete' => $user->can('delete', $invoice),
                'send' => $user->can('send', $invoice),
                'markAsPaid' => $user->can('markAsPaid', $invoice),
                'cancel' => $user->can('cancel', $invoice),
            ],
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

    public function send(
        Invoice $invoice,
        SendInvoiceAction $action,
    ): RedirectResponse {
        $this->authorize('send', $invoice);

        $action($invoice);

        return redirect()
            ->route('invoices.show', $invoice)
            ->with('success', 'Invoice sent successfully.');
    }

    public function cancel(
        Invoice $invoice,
        CancelInvoiceAction $action,
    ): RedirectResponse {
        $this->authorize('cancel', $invoice);

        $action($invoice);

        return redirect()
            ->route('invoices.show', $invoice)
            ->with('success', 'Invoice cancelled.');
    }

    public function download(Invoice $invoice, Request $request): JsonResponse
    {
        $this->authorize('view', $invoice);

        $export = PdfExport::create([
            'invoice_id' => $invoice->id,
            'user_id' => $request->user()->id,
            'status' => 'pending',
        ]);

        GenerateInvoicePdf::dispatch($export);

        return response()->json([
            'export_id' => $export->id,
            'status' => 'pending',
        ]);
    }

    public function downloadStatus(Invoice $invoice, PdfExport $export): JsonResponse
    {
        $this->authorize('view', $invoice);

        return response()->json([
            'status' => $export->status,
            'error' => $export->error,
        ]);
    }

    public function downloadFile(Invoice $invoice, PdfExport $export): \Illuminate\Http\Response
    {
        $this->authorize('view', $invoice);

        abort_unless($export->status === 'completed' && $export->path, 404);

        $pdf = Storage::disk('local')->get($export->path);
        $filename = "{$invoice->invoice_number}.pdf";

        return response($pdf, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }
}
