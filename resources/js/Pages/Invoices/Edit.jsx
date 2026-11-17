import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';

function Label({ htmlFor, children }) {
    return (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {children}
        </label>
    );
}

function Input({ className = '', ...props }) {
    return (
        <input
            {...props}
            className={
                'mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 ' +
                className
            }
        />
    );
}

function getTomorrow() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
}

export default function Edit({ invoice }) {
    const { data, setData, put, processing, errors } = useForm({
        client_name: invoice.client_name || '',
        client_email: invoice.client_email || '',
        due_date: invoice.due_date ? invoice.due_date.split('T')[0] : '',
        tax_rate: invoice.tax_rate || '0',
        notes: invoice.notes || '',
        items: invoice.items?.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unit_price: (item.unit_price / 100).toFixed(2),
        })) || [{ description: '', quantity: 1, unit_price: '' }],
    });

    const addItem = () => {
        setData('items', [...data.items, { description: '', quantity: 1, unit_price: '' }]);
    };

    const removeItem = (index) => {
        if (data.items.length > 1) {
            setData('items', data.items.filter((_, i) => i !== index));
        }
    };

    const updateItem = (index, field, value) => {
        const updated = data.items.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        setData('items', updated);
    };

    const subtotal = data.items.reduce((sum, item) => {
        return sum + (parseFloat(item.unit_price) || 0) * (parseInt(item.quantity) || 0);
    }, 0);
    const tax = subtotal * (parseFloat(data.tax_rate) || 0) / 100;
    const total = subtotal + tax;

    const submit = (e) => {
        e.preventDefault();
        put(route('invoices.update', invoice.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('invoices.show', invoice.id)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                        </svg>
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-100">
                        Edit {invoice.invoice_number}
                    </h2>
                </div>
            }
        >
            <Head title={`Edit ${invoice.invoice_number}`} />

            <div className="py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit}>
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                            <div className="border-b border-gray-200 p-6 dark:border-gray-700">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Client Details</h3>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label htmlFor="client_name">Client Name</Label>
                                        <Input id="client_name" value={data.client_name} onChange={(e) => setData('client_name', e.target.value)} required />
                                        <InputError message={errors.client_name} className="mt-1" />
                                    </div>
                                    <div>
                                        <Label htmlFor="client_email">Client Email</Label>
                                        <Input id="client_email" type="email" value={data.client_email} onChange={(e) => setData('client_email', e.target.value)} required />
                                        <InputError message={errors.client_email} className="mt-1" />
                                    </div>
                                    <div>
                                        <Label htmlFor="due_date">Due Date</Label>
                                        <Input id="due_date" type="date" min={getTomorrow()} value={data.due_date} onChange={(e) => setData('due_date', e.target.value)} required />
                                        <InputError message={errors.due_date} className="mt-1" />
                                    </div>
                                    <div>
                                        <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                                        <Input id="tax_rate" type="number" step="0.01" min="0" max="100" value={data.tax_rate} onChange={(e) => setData('tax_rate', e.target.value)} />
                                        <InputError message={errors.tax_rate} className="mt-1" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Label htmlFor="notes">Notes (optional)</Label>
                                    <textarea
                                        id="notes"
                                        rows="3"
                                        className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                    />
                                    <InputError message={errors.notes} className="mt-1" />
                                </div>
                            </div>

                            <div className="border-b border-gray-200 p-6 dark:border-gray-700">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Line Items</h3>
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50"
                                    >
                                        + Add Item
                                    </button>
                                </div>
                                <InputError message={errors.items} className="mb-4" />

                                <div className="mb-2 hidden items-center gap-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 sm:flex">
                                    <div className="flex-1">Description</div>
                                    <div className="w-24 text-center">Qty</div>
                                    <div className="w-32 text-center">Unit Price</div>
                                    <div className="w-28 text-right">Amount</div>
                                    <div className="w-8"></div>
                                </div>

                                <div className="space-y-3">
                                    {data.items.map((item, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className="flex-1">
                                                <Input placeholder="Description" className="mt-0" value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} required />
                                            </div>
                                            <div className="w-24">
                                                <Input type="number" placeholder="Qty" min="1" className="mt-0 text-center" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)} required />
                                            </div>
                                            <div className="w-32">
                                                <Input type="number" placeholder="0.00" step="0.01" min="0.01" className="mt-0 text-right" value={item.unit_price} onChange={(e) => updateItem(index, 'unit_price', e.target.value)} required />
                                            </div>
                                            <div className="w-28 pt-2 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                                                ${((parseFloat(item.unit_price) || 0) * (parseInt(item.quantity) || 0)).toFixed(2)}
                                            </div>
                                            <div className="w-8 pt-1">
                                                {data.items.length > 1 && (
                                                    <button type="button" onClick={() => removeItem(index)} className="rounded p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20">
                                                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="mb-6 flex flex-col items-end gap-1 text-sm">
                                    <div className="flex w-48 justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                                        <span className="font-medium text-gray-900 dark:text-gray-100">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex w-48 justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Tax ({data.tax_rate || 0}%)</span>
                                        <span className="font-medium text-gray-900 dark:text-gray-100">${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="mt-1 flex w-48 justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
                                        <span className="text-base font-semibold text-gray-900 dark:text-white">Total</span>
                                        <span className="text-base font-semibold text-gray-900 dark:text-white">${total.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <Link href={route('invoices.show', invoice.id)} className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                                        Cancel
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Saving...' : 'Update Invoice'}
                                    </PrimaryButton>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
