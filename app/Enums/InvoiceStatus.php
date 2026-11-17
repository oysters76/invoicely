<?php 

declare(strict_types=1);

namespace App\Enums; 

enum InvoiceStatus: string 
{
 case Draft = 'draft';  
 case Sent = 'sent'; 
 case Paid = 'paid'; 
 case Overdue = 'overdue'; 
 case Cancelled = 'cancelled'; 

 public function canTransitionTo(self $new): bool 
 {
    return match($this) {
        self::Draft => in_array($new, [self::Sent, self::Cancelled]), 
        self::Sent => in_array($new, [self::Paid, self::Overdue, self::Cancelled]), 
        self::Overdue => in_array($new, [self::Paid, self::Cancelled]),  
        default => false, 
    };
 }

 public function label(): string 
 {
    return match($this) {
      self::Draft => 'Draft', 
      self::Sent => 'Sent', 
      self::Paid => 'Paid', 
      self::Overdue => 'Overdue', 
      self::Cancelled => 'Cancelled', 
    }; 
 }

 public function color(): string 
 {
     return match($this) {
        self::Draft => 'gray',
        self::Sent => 'blue',
        self::Paid => 'green',
        self::Overdue => 'red',
        self::Cancelled => 'yellow',
    };
 }
}