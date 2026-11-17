<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest; 

final class StoreInvoiceRequest extends FormRequest
{
 public function authorize(): bool 
 {
    return true; 
 }
 public function rules(): array
 {
    return [
        'client_name' => ['required', 'string', 'max:255'], 
        'client_email' => ['required', 'email'], 
        'due_date' => ['required', 'date', 'after:today'], 
        'tax_rate' => ['required', 'numeric', 'min:0', 'max:100'], 
        'notes' => ['nullable', 'string'], 
        'items' => ['required', 'array', 'min:1'], 
        'items.*.description' => ['required', 'string', 'max:255'], 
        'items.*.quantity' => ['required', 'integer', 'min:1'], 
        'items.*.unit_price' => ['required', 'numeric', 'min:0.01'], 
    ]; 
 }

 public function messages(): array
 {
    return [
        'items.min' => 'An invoice must have at least one line item.', 
        'due_date.after'=>'Due date must be in the future.', 
    ]; 
 }
}