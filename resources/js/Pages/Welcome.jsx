import { Head, Link } from '@inertiajs/react';

function FileTextIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
        </svg>
    );
}

function ShieldIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
            <polyline points="9 12 11 14 15 10" />
        </svg>
    );
}

function DownloadIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
    );
}

function LayersIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
        </svg>
    );
}

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Invoice Management" />

            <div className="min-h-screen bg-white">
                {/* Nav */}
                <nav className="border-b border-gray-100">
                    <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
                        <div className="flex items-center gap-2">
                            <FileTextIcon className="h-6 w-6 text-indigo-600" />
                            <span className="text-lg font-semibold text-gray-900 tracking-tight">
                                Invoicely
                            </span>
                        </div>
                        <div className="flex items-center gap-6">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        Sign in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                                    >
                                        Get started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero */}
                <section className="mx-auto max-w-5xl px-6 pt-20 pb-16">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                            Invoicing that stays out of your way.
                        </h1>
                        <p className="mt-5 text-lg leading-relaxed text-gray-500">
                            Create invoices, track payments, and download PDFs.
                            Built for freelancers and small teams who need something
                            simple that works.
                        </p>
                        <div className="mt-8 flex gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                                >
                                    Go to dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('register')}
                                        className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                                    >
                                        Create free account
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Sign in
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* Divider */}
                <div className="mx-auto max-w-5xl px-6">
                    <hr className="border-gray-100" />
                </div>

                {/* Features */}
                <section className="mx-auto max-w-5xl px-6 py-16">
                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                                <FileTextIcon className="h-5 w-5 text-indigo-600" />
                            </div>
                            <h3 className="mt-4 text-sm font-semibold text-gray-900">
                                Draft, send, get paid
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-gray-500">
                                Invoices move through a clear status workflow.
                                You always know what's outstanding and what's settled.
                            </p>
                        </div>

                        <div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                                <DownloadIcon className="h-5 w-5 text-indigo-600" />
                            </div>
                            <h3 className="mt-4 text-sm font-semibold text-gray-900">
                                PDF export
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-gray-500">
                                Download any invoice as a clean PDF.
                                Send it by email or attach it to your records.
                            </p>
                        </div>

                        <div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                                <LayersIcon className="h-5 w-5 text-indigo-600" />
                            </div>
                            <h3 className="mt-4 text-sm font-semibold text-gray-900">
                                Line items and tax
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-gray-500">
                                Add as many line items as you need.
                                Tax is calculated automatically from the rate you set.
                            </p>
                        </div>

                        <div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                                <ShieldIcon className="h-5 w-5 text-indigo-600" />
                            </div>
                            <h3 className="mt-4 text-sm font-semibold text-gray-900">
                                Your data, your account
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-gray-500">
                                Every invoice is scoped to its owner.
                                Nobody else can view, edit, or download it.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Divider */}
                <div className="mx-auto max-w-5xl px-6">
                    <hr className="border-gray-100" />
                </div>

                {/* CTA */}
                <section className="mx-auto max-w-5xl px-6 py-16">
                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-8 sm:p-10 text-center">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Stop chasing payments in spreadsheets.
                        </h2>
                        <p className="mt-3 mx-auto max-w-lg text-sm leading-relaxed text-gray-500">
                            Set up your account in under a minute. Create your first
                            invoice today and know exactly where your money stands.
                        </p>
                        {!auth.user && (
                            <div className="mt-6">
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                                >
                                    Get started for free
                                </Link>
                            </div>
                        )}
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-gray-100">
                    <div className="mx-auto max-w-5xl px-6 py-8 text-center text-sm text-gray-400">
                        Invoicely
                    </div>
                </footer>
            </div>
        </>
    );
}
