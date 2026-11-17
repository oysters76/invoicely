<?php

declare(strict_types=1);

namespace Tests\Unit\Enums;

use App\Enums\InvoiceStatus;
use PHPUnit\Framework\TestCase;

final class InvoiceStatusTest extends TestCase
{
    public function test_draft_can_transition_to_sent(): void
    {
        $this->assertTrue(InvoiceStatus::Draft->canTransitionTo(InvoiceStatus::Sent));
    }

    public function test_draft_can_transition_to_cancelled(): void
    {
        $this->assertTrue(InvoiceStatus::Draft->canTransitionTo(InvoiceStatus::Cancelled));
    }

    public function test_draft_cannot_transition_to_paid(): void
    {
        $this->assertFalse(InvoiceStatus::Draft->canTransitionTo(InvoiceStatus::Paid));
    }

    public function test_sent_can_transition_to_paid(): void
    {
        $this->assertTrue(InvoiceStatus::Sent->canTransitionTo(InvoiceStatus::Paid));
    }

    public function test_sent_can_transition_to_overdue(): void
    {
        $this->assertTrue(InvoiceStatus::Sent->canTransitionTo(InvoiceStatus::Overdue));
    }

    public function test_sent_can_transition_to_cancelled(): void
    {
        $this->assertTrue(InvoiceStatus::Sent->canTransitionTo(InvoiceStatus::Cancelled));
    }

    public function test_paid_cannot_transition_to_anything(): void
    {
        foreach (InvoiceStatus::cases() as $status) {
            $this->assertFalse(InvoiceStatus::Paid->canTransitionTo($status));
        }
    }

    public function test_cancelled_cannot_transition_to_anything(): void
    {
        foreach (InvoiceStatus::cases() as $status) {
            $this->assertFalse(InvoiceStatus::Cancelled->canTransitionTo($status));
        }
    }

    public function test_overdue_can_transition_to_paid(): void
    {
        $this->assertTrue(InvoiceStatus::Overdue->canTransitionTo(InvoiceStatus::Paid));
    }

    public function test_overdue_can_transition_to_cancelled(): void
    {
        $this->assertTrue(InvoiceStatus::Overdue->canTransitionTo(InvoiceStatus::Cancelled));
    }

    public function test_each_status_has_a_label(): void
    {
        foreach (InvoiceStatus::cases() as $status) {
            $this->assertNotEmpty($status->label());
        }
    }

    public function test_each_status_has_a_color(): void
    {
        foreach (InvoiceStatus::cases() as $status) {
            $this->assertNotEmpty($status->color());
        }
    }
}
