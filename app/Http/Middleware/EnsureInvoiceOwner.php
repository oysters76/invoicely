<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\Invoice;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class EnsureInvoiceOwner
{
    public function handle(Request $request, Closure $next): Response
    {
        $invoice = $request->route('invoice');

        if ($invoice instanceof Invoice && $invoice->user_id !== $request->user()->id) {
            abort(403, 'This invoice does not belong to you.');
        }

        return $next($request);
    }
}
