import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import SunIcon from '@/Components/Icons/SunIcon';
import MoonIcon from '@/Components/Icons/MoonIcon';
import GithubIcon from '@/Components/Icons/GithubIcon';
import FileTextIcon from '@/Components/Icons/FileTextIcon';
import ShieldIcon from '@/Components/Icons/ShieldIcon';
import DownloadIcon from '@/Components/Icons/DownloadIcon';
import LayersIcon from '@/Components/Icons/LayersIcon';

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
                            <button
                                onClick={toggleTheme}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                aria-label="Toggle theme"
                            >
                                {dark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                            </button>
                            <a
                                href="https://github.com/oysters76/invoicely"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                aria-label="GitHub"
                            >
                                <GithubIcon className="h-5 w-5" />
                            </a>
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
