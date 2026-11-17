import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

const statusColors = {
    gray: 'bg-gray-100 text-gray-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
};

function StatCard({ label, value, subtext }) {
    return (
        <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
            {subtext && <p className="mt-1 text-sm text-gray-500">{subtext}</p>}
        </div>
    );
}

function formatCurrency(cents) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(cents / 100);
}

export default function Index({ invoices, stats, filters, statuses }) {
    const handleFilter = (status) => {
        router.get(route('invoices.index'), status ? { status } : {}, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Invoices
                    </h2>
                    <Link
                        href={route('invoices.create')}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        New Invoice
                    </Link>
                </div>
            }
        >
            <Head title="Invoices" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Stats */}
                    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
                        <StatCard
                            label="Total Invoices"
                            value={stats.totalCount}
                        />
                        <StatCard
                            label="Total Amount"
                            value={formatCurrency(stats.totalAmount)}
                        />
                        <StatCard
                            label="Paid"
                            value={stats.paidCount}
                            subtext={formatCurrency(stats.paidAmount)}
                        />
                        <StatCard
                            label="Outstanding"
                            value={stats.totalCount - stats.paidCount}
                            subtext={formatCurrency(stats.unpaidAmount)}
                        />
                    </div>

                    {/* Filters */}
                    <div className="mb-4 flex gap-2">
                        <button
                            onClick={() => handleFilter(null)}
                            className={`rounded-full px-4 py-1 text-sm font-medium ${
                                !filters.status
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            All
                        </button>
                        {statuses.map((status) => {
                            const value = typeof status === 'string' ? status : status.value;
                            return (
                                <button
                                    key={value}
                                    onClick={() => handleFilter(value)}
                                    className={`rounded-full px-4 py-1 text-sm font-medium ${
                                        filters.status === value
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {value.charAt(0).toUpperCase() + value.slice(1)}
                                </button>
                            );
                        })}
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Invoice
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Client
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Due Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {invoices.data?.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            No invoices found. Create your first invoice!
                                        </td>
                                    </tr>
                                )}
                                {invoices.data?.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-gray-50">
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <Link
                                                href={route('invoices.show', invoice.id)}
                                                className="font-medium text-indigo-600 hover:text-indigo-900"
                                            >
                                                {invoice.invoice_number}
                                            </Link>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-gray-900">
                                            {invoice.client_name}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                    statusColors[invoice.status_badge?.color] || statusColors.gray
                                                }`}
                                            >
                                                {invoice.status_badge?.label}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right font-medium text-gray-900">
                                            {invoice.formatted_total}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                                            {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {invoices.links && (
                        <div className="mt-4 flex justify-center gap-1">
                            {invoices.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`rounded px-3 py-1 text-sm ${
                                        link.active
                                            ? 'bg-indigo-600 text-white'
                                            : link.url
                                                ? 'bg-white text-gray-700 hover:bg-gray-100'
                                                : 'cursor-default bg-white text-gray-400'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    preserveState
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
