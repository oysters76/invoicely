import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        client_name: '',
        client_email: '',
        due_date: '',
        tax_rate: '0',
        notes: '',
        items: [{ description: '', quantity: 1, unit_price: '' }],
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

    const calculateSubtotal = () => {
        return data.items.reduce((sum, item) => {
            return sum + (parseFloat(item.unit_price) || 0) * (parseInt(item.quantity) || 0);
        }, 0);
    };

    const subtotal = calculateSubtotal();
    const tax = subtotal * (parseFloat(data.tax_rate) || 0) / 100;
    const total = subtotal + tax;

    const submit = (e) => {
        e.preventDefault();
        post(route('invoices.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('invoices.index')} className="text-gray-500 hover:text-gray-700">
                        &larr; Back
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        New Invoice
                    </h2>
                </div>
            }
        >
            <Head title="New Invoice" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit}>
                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            {/* Client Details */}
                            <div className="border-b border-gray-200 p-6">
                                <h3 className="mb-4 text-lg font-medium text-gray-900">Client Details</h3>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="client_name" value="Client Name" />
                                        <TextInput
                                            id="client_name"
                                            className="mt-1 block w-full"
                                            value={data.client_name}
                                            onChange={(e) => setData('client_name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.client_name} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="client_email" value="Client Email" />
                                        <TextInput
                                            id="client_email"
                                            type="email"
                                            className="mt-1 block w-full"
                                            value={data.client_email}
                                            onChange={(e) => setData('client_email', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.client_email} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="due_date" value="Due Date" />
                                        <TextInput
                                            id="due_date"
                                            type="date"
                                            className="mt-1 block w-full"
                                            value={data.due_date}
                                            onChange={(e) => setData('due_date', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.due_date} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="tax_rate" value="Tax Rate (%)" />
                                        <TextInput
                                            id="tax_rate"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="100"
                                            className="mt-1 block w-full"
                                            value={data.tax_rate}
                                            onChange={(e) => setData('tax_rate', e.target.value)}
                                        />
                                        <InputError message={errors.tax_rate} className="mt-2" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <InputLabel htmlFor="notes" value="Notes (optional)" />
                                    <textarea
                                        id="notes"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        rows="3"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                    />
                                    <InputError message={errors.notes} className="mt-2" />
                                </div>
                            </div>

                            {/* Line Items */}
                            <div className="border-b border-gray-200 p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900">Line Items</h3>
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                                    >
                                        + Add Item
                                    </button>
                                </div>
                                <InputError message={errors.items} className="mb-4" />

                                <div className="space-y-3">
                                    {data.items.map((item, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className="flex-1">
                                                <TextInput
                                                    placeholder="Description"
                                                    className="block w-full"
                                                    value={item.description}
                                                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                                                    required
                                                />
                                                <InputError message={errors[`items.${index}.description`]} className="mt-1" />
                                            </div>
                                            <div className="w-24">
                                                <TextInput
                                                    type="number"
                                                    placeholder="Qty"
                                                    min="1"
                                                    className="block w-full"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                    required
                                                />
                                                <InputError message={errors[`items.${index}.quantity`]} className="mt-1" />
                                            </div>
                                            <div className="w-32">
                                                <TextInput
                                                    type="number"
                                                    placeholder="Price"
                                                    step="0.01"
                                                    min="0.01"
                                                    className="block w-full"
                                                    value={item.unit_price}
                                                    onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                                                    required
                                                />
                                                <InputError message={errors[`items.${index}.unit_price`]} className="mt-1" />
                                            </div>
                                            <div className="w-28 pt-2 text-right font-medium text-gray-900">
                                                ${((parseFloat(item.unit_price) || 0) * (parseInt(item.quantity) || 0)).toFixed(2)}
                                            </div>
                                            {data.items.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(index)}
                                                    className="pt-2 text-red-500 hover:text-red-700"
                                                >
                                                    &times;
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Totals & Submit */}
                            <div className="p-6">
                                <div className="mb-6 flex flex-col items-end gap-1">
                                    <div className="flex gap-8">
                                        <span className="text-sm text-gray-500">Subtotal</span>
                                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex gap-8">
                                        <span className="text-sm text-gray-500">Tax ({data.tax_rate || 0}%)</span>
                                        <span className="font-medium">${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="mt-1 flex gap-8 border-t pt-1">
                                        <span className="font-semibold">Total</span>
                                        <span className="font-semibold">${total.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Creating...' : 'Create Invoice'}
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
