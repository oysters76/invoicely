import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const statusColors = {
    gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    red: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
};

function formatCurrency(cents) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

function fmtDate(d) {
    if (!d) return null;
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function CheckIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

function StatusStepper({ invoice }) {
    const status = invoice.status?.value || invoice.status;
    const isCancelled = status === 'cancelled';

    const steps = [
        { key: 'draft', label: 'Created', date: invoice.created_at, color: 'gray' },
        { key: 'sent', label: 'Sent', date: invoice.issued_at, color: 'blue' },
        ...(status === 'overdue'
            ? [{ key: 'overdue', label: 'Overdue', date: invoice.due_date, color: 'red' }]
            : []),
        { key: 'paid', label: 'Paid', date: invoice.paid_at, color: 'green' },
    ];

    const statusOrder = { draft: 0, sent: 1, overdue: 2, paid: 3 };
    const currentIdx = statusOrder[status] ?? -1;

    const stepColors = {
        completed: {
            dot: 'bg-indigo-600 dark:bg-indigo-500',
            line: 'bg-indigo-600 dark:bg-indigo-500',
            text: 'text-gray-900 dark:text-white',
        },
        current: {
            dot: 'bg-indigo-600 dark:bg-indigo-500 ring-4 ring-indigo-100 dark:ring-indigo-900/50',
            line: 'bg-gray-200 dark:bg-gray-700',
            text: 'text-indigo-700 dark:text-indigo-300 font-semibold',
        },
        upcoming: {
            dot: 'bg-gray-200 dark:bg-gray-700',
            line: 'bg-gray-200 dark:bg-gray-700',
            text: 'text-gray-400 dark:text-gray-600',
        },
    };

    if (isCancelled) {
        return (
            <div className="rounded-xl border border-yellow-200 bg-yellow-50/50 p-5 dark:border-yellow-800/50 dark:bg-yellow-900/10">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-500 text-white">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-semibold text-yellow-800 dark:text-yellow-200">Invoice Cancelled</p>
                        {invoice.cancelled_at && (
                            <p className="text-sm text-yellow-600 dark:text-yellow-400">{fmtDate(invoice.cancelled_at)}</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center">
                {steps.map((step, i) => {
                    const stepIdx = statusOrder[step.key];
                    const state = stepIdx < currentIdx ? 'completed' : stepIdx === currentIdx ? 'current' : 'upcoming';
                    const colors = stepColors[state];
                    const isLast = i === steps.length - 1;

                    return (
                        <div key={step.key} className={`flex items-center ${isLast ? '' : 'flex-1'}`}>
                            <div className="flex flex-col items-center">
                                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${colors.dot}`}>
                                    {state === 'completed' ? (
                                        <CheckIcon className="h-4 w-4 text-white" />
                                    ) : state === 'current' ? (
                                        <div className="h-2.5 w-2.5 rounded-full bg-white" />
                                    ) : (
                                        <div className="h-2.5 w-2.5 rounded-full bg-gray-400 dark:bg-gray-500" />
                                    )}
                                </div>
                                <span className={`mt-2 text-xs ${colors.text}`}>{step.label}</span>
                                {step.date && state !== 'upcoming' && (
                                    <span className="text-[10px] text-gray-400 dark:text-gray-500">{fmtDate(step.date)}</span>
                                )}
                            </div>
                            {!isLast && (
                                <div className={`mx-2 h-0.5 flex-1 rounded ${state === 'completed' ? colors.line : stepColors.upcoming.line}`} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function Show({ invoice, can }) {
    const [pdfStatus, setPdfStatus] = useState('idle');

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this invoice?')) {
            router.delete(route('invoices.destroy', invoice.id));
        }
    };

    const handleMarkPaid = () => router.patch(route('invoices.mark-paid', invoice.id));
    const handleSend = () => router.patch(route('invoices.send', invoice.id));
    const handleCancel = () => {
        if (confirm('Cancel this invoice? This cannot be undone.')) {
            router.patch(route('invoices.cancel', invoice.id));
        }
    };

    const handleDownload = async () => {
        setPdfStatus('generating');
        try {
            const res = await fetch(route('invoices.download', invoice.id), {
                headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            });
            const { export_id } = await res.json();
            const poll = async () => {
                const statusRes = await fetch(
                    route('invoices.download.status', { invoice: invoice.id, export: export_id }),
                    { headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' } }
                );
                const data = await statusRes.json();
                if (data.status === 'completed') {
                    setPdfStatus('idle');
                    window.location.href = route('invoices.download.file', { invoice: invoice.id, export: export_id });
                } else if (data.status === 'failed') {
                    setPdfStatus('idle');
                    alert('PDF generation failed: ' + (data.error || 'Unknown error'));
                } else {
                    setTimeout(poll, 1000);
                }
            };
            poll();
        } catch {
            setPdfStatus('idle');
            alert('Failed to start PDF generation.');
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('invoices.index')} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                            </svg>
                        </Link>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-100">
                            {invoice.invoice_number}
                        </h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={handleDownload}
                            disabled={pdfStatus === 'generating'}
                            className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:opacity-50 dark:bg-gray-500 dark:hover:bg-gray-600"
                        >
                            {pdfStatus === 'generating' ? (
                                <>
                                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeDasharray="31.42" strokeDashoffset="10" /></svg>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                    PDF
                                </>
                            )}
                        </button>

                        {can.send && (
                            <button onClick={handleSend} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                                Send
                            </button>
                        )}
                        {can.markAsPaid && (
                            <button onClick={handleMarkPaid} className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                Mark Paid
                            </button>
                        )}
                        {can.edit && (
                            <Link href={route('invoices.edit', invoice.id)} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                Edit
                            </Link>
                        )}
                        {can.cancel && (
                            <button onClick={handleCancel} className="inline-flex items-center gap-1.5 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-800 transition hover:bg-yellow-100 dark:border-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 dark:hover:bg-yellow-900/50">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>
                                Cancel
                            </button>
                        )}
                        {can.delete && (
                            <button onClick={handleDelete} className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                Delete
                            </button>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={invoice.invoice_number} />

            <div className="py-8">
                <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">
                    {/* Status Stepper */}
                    <StatusStepper invoice={invoice} />

                    {/* Invoice Card */}
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                        {/* Client Info */}
                        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                <div>
                                    <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Client</h3>
                                    <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">{invoice.client_name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{invoice.client_email}</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Invoice Date</h3>
                                    <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                                        {fmtDate(invoice.created_at)}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Due Date</h3>
                                    <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                                        {invoice.due_date ? fmtDate(invoice.due_date) : '—'}
                                    </p>
                                    {invoice.paid_at && (
                                        <p className="mt-0.5 text-sm text-green-600 dark:text-green-400">
                                            Paid {fmtDate(invoice.paid_at)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Line Items */}
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Description</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Qty</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Unit Price</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                                {invoice.items?.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{item.description}</td>
                                        <td className="px-6 py-4 text-right text-gray-900 dark:text-gray-100">{item.quantity}</td>
                                        <td className="px-6 py-4 text-right text-gray-900 dark:text-gray-100">{formatCurrency(item.unit_price)}</td>
                                        <td className="px-6 py-4 text-right text-gray-900 dark:text-gray-100">{formatCurrency(item.amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Totals */}
                        <div className="border-t border-gray-200 p-6 dark:border-gray-700">
                            <div className="flex flex-col items-end gap-1 text-sm">
                                <div className="flex w-48 justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">{invoice.formatted_subtotal}</span>
                                </div>
                                <div className="flex w-48 justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Tax ({invoice.tax_rate}%)</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">{invoice.formatted_tax_amount}</span>
                                </div>
                                <div className="mt-1 flex w-48 justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
                                    <span className="text-base font-semibold text-gray-900 dark:text-white">Total</span>
                                    <span className="text-base font-semibold text-gray-900 dark:text-white">{invoice.formatted_total}</span>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        {invoice.notes && (
                            <div className="border-t border-gray-200 p-6 dark:border-gray-700">
                                <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Notes</h3>
                                <p className="mt-2 text-gray-900 dark:text-gray-100">{invoice.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
