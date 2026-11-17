import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

const statusColors = {
    gray: 'bg-gray-100 text-gray-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
};

function formatCurrency(cents) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(cents / 100);
}

export default function Show({ invoice }) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this invoice?')) {
            router.delete(route('invoices.destroy', invoice.id));
        }
    };

    const handleMarkPaid = () => {
        router.patch(route('invoices.mark-paid', invoice.id));
    };

    const handleSend = () => {
        router.patch(route('invoices.send', invoice.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('invoices.index')}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            &larr; Back
                        </Link>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            {invoice.invoice_number}
                        </h2>
                        <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                statusColors[invoice.status_badge?.color] || statusColors.gray
                            }`}
                        >
                            {invoice.status_badge?.label}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <a
                            href={route('invoices.download', invoice.id)}
                            className="inline-flex items-center rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                        >
                            Download PDF
                        </a>
                        {invoice.status?.value === 'draft' && (
                            <>
                                <button
                                    onClick={handleSend}
                                    className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    Send Invoice
                                </button>
                                <Link
                                    href={route('invoices.edit', invoice.id)}
                                    className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </>
                        )}
                        {invoice.status?.value === 'sent' && (
                            <button
                                onClick={handleMarkPaid}
                                className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                            >
                                Mark as Paid
                            </button>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={invoice.invoice_number} />

            <div className="py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        {/* Client Info */}
                        <div className="border-b border-gray-200 p-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Client</h3>
                                    <p className="mt-1 text-lg font-medium text-gray-900">
                                        {invoice.client_name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {invoice.client_email}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
                                    <p className="mt-1 text-lg font-medium text-gray-900">
                                        {invoice.due_date
                                            ? new Date(invoice.due_date).toLocaleDateString()
                                            : '—'}
                                    </p>
                                    {invoice.paid_at && (
                                        <p className="text-sm text-green-600">
                                            Paid on {new Date(invoice.paid_at).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Line Items */}
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Qty
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Unit Price
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Amount
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {invoice.items?.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 text-gray-900">
                                            {item.description}
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-900">
                                            {item.quantity}
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-900">
                                            {formatCurrency(item.unit_price)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-900">
                                            {formatCurrency(item.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Totals */}
                        <div className="border-t border-gray-200 p-6">
                            <div className="flex flex-col items-end gap-2">
                                <div className="flex justify-between gap-16">
                                    <span className="text-sm text-gray-500">Subtotal</span>
                                    <span className="font-medium text-gray-900">
                                        {invoice.formatted_subtotal}
                                    </span>
                                </div>
                                <div className="flex justify-between gap-16">
                                    <span className="text-sm text-gray-500">
                                        Tax ({invoice.tax_rate}%)
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {invoice.formatted_tax_amount}
                                    </span>
                                </div>
                                <div className="mt-2 flex justify-between gap-16 border-t border-gray-200 pt-2">
                                    <span className="text-base font-semibold text-gray-900">Total</span>
                                    <span className="text-base font-semibold text-gray-900">
                                        {invoice.formatted_total}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        {invoice.notes && (
                            <div className="border-t border-gray-200 p-6">
                                <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                                <p className="mt-1 text-gray-900">{invoice.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
