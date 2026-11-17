<?php 

declare(strict_types=1);

namespace App\Exceptions;

use App\Enums\InvoiceStatus; 
use DomainException; 

final class InvalidStatusTransitionException extends DomainException
{
    public function __construct(
        public readonly InvoiceStatus $from, 
        public readonly InvoiceStatus $to, 
    ){
        parent::__construct(
            "Cannot transition from {$from->label()} to {$to->label()}"
        ); 
    }
}