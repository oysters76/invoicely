import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

function SunIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
    );
}

function MoonIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
    );
}

function GithubIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
        </svg>
    );
}

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
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('theme');
        if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setDark(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        const next = !dark;
        setDark(next);
        document.documentElement.classList.toggle('dark', next);
        localStorage.setItem('theme', next ? 'dark' : 'light');
    };

    return (
        <>
            <Head title="Invoice Management" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
                {/* Nav */}
                <nav className="border-b border-gray-200 dark:border-gray-800">
                    <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
                        <div className="flex items-center gap-2">
                            <FileTextIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            <span className="text-lg font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
                                Invoicely
                            </span>
                        </div>
                        <div className="flex items-center gap-5">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                aria-label="GitHub"
                            >
                                <GithubIcon className="h-5 w-5" />
                            </a>
                            <button
                                onClick={toggleTheme}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                aria-label="Toggle theme"
                            >
                                {dark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                            </button>
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                    >
                                        Sign in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
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
                        <h1 className="text-4xl font-bold tracking-tight text-gray-800 dark:text-gray-100 sm:text-5xl">
                            Invoicing that stays out of your way.
                        </h1>
                        <p className="mt-5 text-lg leading-relaxed text-gray-500 dark:text-gray-400">
                            Create invoices, track payments, and download PDFs.
                            Built for freelancers and small teams who need something
                            simple that works.
                        </p>
                        <div className="mt-8 flex gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
                                >
                                    Go to dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('register')}
                                        className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
                                    >
                                        Create free account
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="rounded-md border border-gray-300 dark:border-gray-700 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
                    <hr className="border-gray-200 dark:border-gray-800" />
                </div>

                {/* Features */}
                <section className="mx-auto max-w-5xl px-6 py-16">
                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950">
                                <FileTextIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="mt-4 text-sm font-semibold text-gray-800 dark:text-gray-200">
                                Draft, send, get paid
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                                Invoices move through a clear status workflow.
                                You always know what's outstanding and what's settled.
                            </p>
                        </div>

                        <div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950">
                                <DownloadIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="mt-4 text-sm font-semibold text-gray-800 dark:text-gray-200">
                                PDF export
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                                Download any invoice as a clean PDF.
                                Send it by email or attach it to your records.
                            </p>
                        </div>

                        <div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950">
                                <LayersIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="mt-4 text-sm font-semibold text-gray-800 dark:text-gray-200">
                                Line items and tax
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                                Add as many line items as you need.
                                Tax is calculated automatically from the rate you set.
                            </p>
                        </div>

                        <div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950">
                                <ShieldIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="mt-4 text-sm font-semibold text-gray-800 dark:text-gray-200">
                                Your data, your account
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                                Every invoice is scoped to its owner.
                                Nobody else can view, edit, or download it.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Divider */}
                <div className="mx-auto max-w-5xl px-6">
                    <hr className="border-gray-200 dark:border-gray-800" />
                </div>

                {/* CTA */}
                <section className="mx-auto max-w-5xl px-6 py-16">
                    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 sm:p-10 text-center">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            Stop chasing payments in spreadsheets.
                        </h2>
                        <p className="mt-3 mx-auto max-w-lg text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                            Set up your account in under a minute. Create your first
                            invoice today and know exactly where your money stands.
                        </p>
                        {!auth.user && (
                            <div className="mt-6">
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
                                >
                                    Get started for free
                                </Link>
                            </div>
                        )}
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-gray-200 dark:border-gray-800">
                    <div className="mx-auto max-w-5xl px-6 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
                        Invoicely
                    </div>
                </footer>
            </div>
        </>
    );
}
