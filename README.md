# Invoicely

A full-stack invoice management application built with Laravel 11, React, and Inertia.js.

## Features

- Create, edit, and delete invoices with line items
- Status workflow: Draft → Sent → Paid (with Overdue and Cancelled states)
- PDF export for any invoice
- Dashboard with stats and status filters
- Dark mode support

## Tech Stack

- **Backend:** Laravel 11, PHP 8.3
- **Frontend:** React, Inertia.js, Tailwind CSS
- **Database:** PostgreSQL
- **Infrastructure:** Docker, Nginx, Dev Containers

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
3. Reopen in Container (Ctrl+Shift+P → "Dev Containers: Reopen in Container")
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

- **Email:** demo@invoicely.test
- **Password:** password

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
