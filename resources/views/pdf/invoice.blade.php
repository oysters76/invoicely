<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $invoice->invoice_number }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #1f2937; line-height: 1.5; }
        .container { padding: 40px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .invoice-title { font-size: 28px; font-weight: bold; color: #4f46e5; }
        .invoice-number { font-size: 14px; color: #6b7280; margin-top: 4px; }
        .meta-table { width: 100%; margin-bottom: 30px; }
        .meta-table td { padding: 4px 0; vertical-align: top; }
        .meta-label { color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
        .meta-value { font-weight: 600; }
        .status { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
        .status-draft { background: #f3f4f6; color: #374151; }
        .status-sent { background: #dbeafe; color: #1e40af; }
        .status-paid { background: #dcfce7; color: #166534; }
        .status-overdue { background: #fef2f2; color: #991b1b; }
        .status-cancelled { background: #fefce8; color: #854d0e; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .items-table th { background: #f9fafb; border-bottom: 2px solid #e5e7eb; padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; }
        .items-table th:nth-child(2), .items-table th:nth-child(3), .items-table th:nth-child(4) { text-align: right; }
        .items-table td { border-bottom: 1px solid #f3f4f6; padding: 10px 12px; }
        .items-table td:nth-child(2), .items-table td:nth-child(3), .items-table td:nth-child(4) { text-align: right; }
        .totals { width: 280px; margin-left: auto; }
        .totals-row { display: flex; justify-content: space-between; padding: 6px 0; }
        .totals-row.total { border-top: 2px solid #1f2937; padding-top: 10px; margin-top: 6px; font-weight: bold; font-size: 14px; }
        .totals-label { color: #6b7280; }
        .notes { margin-top: 30px; padding: 16px; background: #f9fafb; border-radius: 6px; }
        .notes-title { font-weight: 600; margin-bottom: 4px; }
        .footer { margin-top: 60px; text-align: center; color: #9ca3af; font-size: 10px; border-top: 1px solid #e5e7eb; padding-top: 16px; }
    </style>
</head>
<body>
    <div class="container">
        <table style="width:100%; margin-bottom: 40px;">
            <tr>
                <td>
                    <div class="invoice-title">INVOICE</div>
                    <div class="invoice-number">{{ $invoice->invoice_number }}</div>
                </td>
                <td style="text-align: right;">
                    <span class="status status-{{ $invoice->status->value }}">
                        {{ $invoice->status->label() }}
                    </span>
                </td>
            </tr>
        </table>

        <table class="meta-table">
            <tr>
                <td style="width: 50%;">
                    <div class="meta-label">From</div>
                    <div class="meta-value">{{ $invoice->user->name }}</div>
                    <div>{{ $invoice->user->email }}</div>
                </td>
                <td style="width: 50%;">
                    <div class="meta-label">Bill To</div>
                    <div class="meta-value">{{ $invoice->client_name }}</div>
                    <div>{{ $invoice->client_email }}</div>
                </td>
            </tr>
            <tr>
                <td style="padding-top: 16px;">
                    <div class="meta-label">Issue Date</div>
                    <div class="meta-value">{{ $invoice->created_at->format('M d, Y') }}</div>
                </td>
                <td style="padding-top: 16px;">
                    <div class="meta-label">Due Date</div>
                    <div class="meta-value">{{ $invoice->due_date->format('M d, Y') }}</div>
                </td>
            </tr>
            @if($invoice->paid_at)
            <tr>
                <td style="padding-top: 16px;">
                    <div class="meta-label">Paid On</div>
                    <div class="meta-value">{{ $invoice->paid_at->format('M d, Y') }}</div>
                </td>
                <td></td>
            </tr>
            @endif
        </table>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $item)
                <tr>
                    <td>{{ $item->description }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td>${{ number_format($item->unit_price / 100, 2) }}</td>
                    <td>${{ number_format($item->amount / 100, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="totals">
            <div class="totals-row">
                <span class="totals-label">Subtotal</span>
                <span>{{ $invoice->formatted_subtotal }}</span>
            </div>
            <div class="totals-row">
                <span class="totals-label">Tax ({{ $invoice->tax_rate }}%)</span>
                <span>{{ $invoice->formatted_tax_amount }}</span>
            </div>
            <div class="totals-row total">
                <span>Total</span>
                <span>{{ $invoice->formatted_total }}</span>
            </div>
        </div>

        @if($invoice->notes)
        <div class="notes">
            <div class="notes-title">Notes</div>
            <div>{{ $invoice->notes }}</div>
        </div>
        @endif

        <div class="footer">
            Generated on {{ now()->format('M d, Y') }}
        </div>
    </div>
</body>
</html>
