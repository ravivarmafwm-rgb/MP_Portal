<?php

namespace App\Console\Commands;

use App\Models\Appointment;
use App\Models\PublicMeeting;
use App\Services\NotificationService;
use Illuminate\Console\Command;

class SendMeetingReminders extends Command
{
    protected $signature = 'meetings:reminders {--dry-run}';
    protected $description = 'Notify assigned officers about imminent meetings and due follow-ups.';

    public function handle(): int
    {
        $tomorrow = now()->addDay()->toDateString();
        $sent = 0;
        Appointment::with('assignedOfficer')->whereDate('scheduled_date', $tomorrow)->whereNotIn('status', ['cancelled', 'completed'])->each(function (Appointment $appointment) use (&$sent): void {
            if ($appointment->assignedOfficer && !$this->option('dry-run')) {
                NotificationService::notifyUser($appointment->assignedOfficer, 'Upcoming appointment', "Appointment {$appointment->appointment_number} is scheduled for tomorrow.", 'meeting', "/meetings/appointments/{$appointment->id}", $appointment, 'high');
                $sent++;
            }
        });
        Appointment::with('assignedOfficer')->where('follow_up_required', true)->where('follow_up_completed', false)->whereDate('follow_up_date', '<=', now()->toDateString())->each(function (Appointment $appointment) use (&$sent): void {
            if ($appointment->assignedOfficer && !$this->option('dry-run')) {
                NotificationService::notifyUser($appointment->assignedOfficer, 'Meeting follow-up due', "Follow-up for appointment {$appointment->appointment_number} is due.", 'meeting', "/meetings/appointments/{$appointment->id}", $appointment, 'high');
                $sent++;
            }
        });
        $this->info("{$sent} meeting notifications dispatched.");
        return self::SUCCESS;
    }
}
