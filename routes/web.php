<?php

use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::get('/dashboard', function () {
    return redirect()->route('invoices.index');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('invoices', InvoiceController::class);
    Route::patch('/invoices/{invoice}/mark-paid', [InvoiceController::class, 'markAsPaid'])
        ->name('invoices.mark-paid');
    Route::patch('/invoices/{invoice}/send', [InvoiceController::class, 'send'])
        ->name('invoices.send');
    Route::patch('/invoices/{invoice}/cancel', [InvoiceController::class, 'cancel'])
        ->name('invoices.cancel');
    Route::get('/invoices/{invoice}/download', [InvoiceController::class, 'download'])
        ->name('invoices.download');
    Route::get('/invoices/{invoice}/download/{export}/status', [InvoiceController::class, 'downloadStatus'])
        ->name('invoices.download.status');
    Route::get('/invoices/{invoice}/download/{export}/file', [InvoiceController::class, 'downloadFile'])
        ->name('invoices.download.file');
});

require __DIR__.'/auth.php';
