<p align="center">
  <img src="https://img.shields.io/badge/%F0%9F%93%84-Invoicely-4f46e5?style=for-the-badge&labelColor=eef2ff" alt="Invoicely" height="48">
</p>

<h1 align="center">Invoicely</h1>

<p align="center">
  A full-stack invoice management application built with Laravel, React, and Inertia.js.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/PHP-8.3-777BB4?logo=php&logoColor=white" alt="PHP">
  <img src="https://img.shields.io/badge/Laravel-11-FF2D20?logo=laravel&logoColor=white" alt="Laravel">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white" alt="Docker">
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/oysters76/invoicely" alt="License">
  <img src="https://img.shields.io/github/last-commit/oysters76/invoicely" alt="Last Commit">
  <img src="https://img.shields.io/github/stars/oysters76/invoicely?style=social" alt="Stars">
</p>

---

## Features

- Create, edit, and delete invoices with line items
- Status workflow: Draft → Sent → Paid (with Overdue and Cancelled states)
- PDF export for any invoice
- Dashboard with stats and status filters
- Dark mode support

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 11, PHP 8.3 |
| Frontend | React 18, Inertia.js, Tailwind CSS |
| Database | PostgreSQL |
| Infrastructure | Docker, Nginx, VS Code Dev Containers |

## Architecture

Built with SOLID principles:

- **Repository pattern** for data access
- **Service layer** for business logic
- **Action classes** for use-case orchestration
- **DTOs** for data transfer between layers
- **Interface-driven** dependency injection
- **Backed Enum** state machine for invoice status
- **Custom middleware** for security headers and access logging

## Getting Started

### With Dev Containers (recommended)

1. Open the project in VS Code
2. Install the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension
3. Reopen in Container (`Ctrl+Shift+P` → "Dev Containers: Reopen in Container")
4. Wait for the container to build and dependencies to install

### With Docker Compose

```bash
docker-compose up -d
docker exec -it invoices-app composer install
docker exec -it invoices-app npm install
```

### Setup

```bash
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm run dev
```

### Demo Account

After seeding, log in with:

| | |
|---|---|
| **Email** | `demo@invoicely.test` |
| **Password** | `password` |

## Running Tests

```bash
php artisan test
```

## Project Structure

```
app/
├── Actions/          # Invokable use-case classes
├── Contracts/        # Interfaces (Repository, Service, PdfGenerator)
├── DTOs/             # Immutable data transfer objects
├── Enums/            # InvoiceStatus backed enum
├── Exceptions/       # Domain exceptions
├── Http/
│   ├── Controllers/  # Thin controllers delegating to actions
│   ├── Middleware/    # Security headers, ownership, logging
│   └── Requests/     # Form request validation
├── Models/           # Eloquent models with scopes and accessors
├── Policies/         # Authorization policies
├── Providers/        # Interface bindings
├── Repositories/     # Eloquent repository implementations
└── Services/         # Business logic and PDF generation
```

## Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change.

## License

This project is open-sourced under the [MIT License](LICENSE).
