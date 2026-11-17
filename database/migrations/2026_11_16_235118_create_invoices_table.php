<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id(); 
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); 
            $table->string('invoice_number')->unique(); 
            $table->string('client_name'); 
            $table->string('client_email'); 
            $table->string('status')->default('draft'); 
            $table->integer('subtotal')->default(0); 
            $table->decimal('tax_rate', 5, 2)->default(0); 
            $table->integer('tax_amount')->default(0); 
            $table->integer('total')->default(0); 
            $table->date('due_date'); 
            $table->text('notes')->nullable(); 
            $table->timestamp('issued_at')->nullable();
            $table->timestamp('paid_at')->nullable(); 
            $table->softDeletes(); 
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
