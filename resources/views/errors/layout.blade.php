<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title') — Invoicely</title>
    <script>
        if (localStorage.getItem('darkMode') === 'true') {
            document.documentElement.classList.add('dark');
        }
    </script>
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
            background-color: #f9fafb;
            color: #111827;
        }

        .dark body {
            background-color: #030712;
            color: #f3f4f6;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            text-decoration: none;
            margin-bottom: 3rem;
        }

        .logo svg { width: 2.5rem; height: 2.5rem; color: #4f46e5; }
        .dark .logo svg { color: #818cf8; }

        .logo span {
            font-size: 1.5rem;
            font-weight: 700;
            color: #111827;
        }
        .dark .logo span { color: #f9fafb; }

        .error-code {
            font-size: 7rem;
            font-weight: 800;
            line-height: 1;
            color: #e5e7eb;
            margin-bottom: 1rem;
        }
        .dark .error-code { color: #1f2937; }

        h1 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }

        .pun {
            color: #6b7280;
            font-size: 0.95rem;
            margin-bottom: 2rem;
            text-align: center;
            max-width: 28rem;
            line-height: 1.5;
        }
        .dark .pun { color: #9ca3af; }

        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.625rem 1.25rem;
            background-color: #4f46e5;
            color: #fff;
            border-radius: 0.5rem;
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 500;
            transition: background-color 0.15s;
        }
        .back-link:hover { background-color: #4338ca; }
        .dark .back-link { background-color: #6366f1; }
        .dark .back-link:hover { background-color: #4f46e5; }

        .back-link svg { width: 1rem; height: 1rem; }

        .secondary-link {
            display: inline-block;
            margin-top: 1rem;
            color: #6b7280;
            font-size: 0.875rem;
            text-decoration: none;
        }
        .secondary-link:hover { color: #4f46e5; }
        .dark .secondary-link { color: #9ca3af; }
        .dark .secondary-link:hover { color: #818cf8; }
    </style>
</head>
<body>
    <a href="/" class="logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
        </svg>
        <span>Invoicely</span>
    </a>

    <div class="error-code">@yield('code')</div>
    <h1>@yield('heading')</h1>
    <p class="pun">@yield('pun')</p>

    <a href="/" class="back-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
        </svg>
        Back to home
    </a>

    @auth
    <a href="{{ route('invoices.index') }}" class="secondary-link">or go to your invoices</a>
    @endauth
</body>
</html>
