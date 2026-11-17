import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

const statusColors = {
    gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    red: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
};

function StatCard({ label, value, subtext }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            {subtext && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtext}</p>}
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
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-100">
                        Invoices
                    </h2>
                    <Link
                        href={route('invoices.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                    >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
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
                        <StatCard label="Total Invoices" value={stats.totalCount} />
                        <StatCard label="Total Amount" value={formatCurrency(stats.totalAmount)} />
                        <StatCard label="Paid" value={stats.paidCount} subtext={formatCurrency(stats.paidAmount)} />
                        <StatCard label="Outstanding" value={stats.totalCount - stats.paidCount} subtext={formatCurrency(stats.unpaidAmount)} />
                    </div>

                    {/* Filters */}
                    <div className="mb-4 flex flex-wrap gap-2">
                        <button
                            onClick={() => handleFilter(null)}
                            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                                !filters.status
                                    ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
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
                                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                                        filters.status === value
                                            ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {value.charAt(0).toUpperCase() + value.slice(1)}
                                </button>
                            );
                        })}
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Invoice</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Client</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Due Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                                {invoices.data?.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            No invoices found. Create your first invoice!
                                        </td>
                                    </tr>
                                )}
                                {invoices.data?.map((invoice) => (
                                    <tr
                                        key={invoice.id}
                                        onClick={() => router.visit(route('invoices.show', invoice.id))}
                                        className="cursor-pointer transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    >
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span className="font-medium text-indigo-600 dark:text-indigo-400">
                                                {invoice.invoice_number}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-gray-900 dark:text-gray-100">
                                            {invoice.client_name}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[invoice.status_badge?.color] || statusColors.gray}`}>
                                                {invoice.status_badge?.label}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right font-medium text-gray-900 dark:text-gray-100">
                                            {invoice.formatted_total}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">
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
                                    className={`rounded-lg px-3 py-1.5 text-sm transition ${
                                        link.active
                                            ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                                            : link.url
                                                ? 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                                : 'cursor-default bg-white text-gray-400 dark:bg-gray-800 dark:text-gray-600'
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
