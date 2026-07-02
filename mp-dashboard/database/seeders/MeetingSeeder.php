<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Citizen;
use App\Models\Constituency;
use App\Models\JanataDarbarSession;
use App\Models\Mandal;
use App\Models\MeetingNote;
use App\Models\MpTour;
use App\Models\PublicMeeting;
use App\Models\User;
use App\Models\Village;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MeetingSeeder extends Seeder
{
    public function run(): void
    {
        $admin     = User::whereHas('role', fn($q) => $q->where('slug', 'super-admin'))->first();
        $adminId   = $admin?->id;

        $constituency = Constituency::first();
        $mandals      = Mandal::take(5)->get();
        $villages     = Village::take(10)->get();
        $citizens     = Citizen::take(50)->get();

        $purposes = [
            'Road repair request', 'Pension application help', 'Scheme enrollment',
            'Water supply complaint', 'Employment assistance', 'Medical aid request',
            'Land dispute', 'Education scholarship', 'Electricity connection',
            'Housing scheme application', 'Agricultural support', 'Flood relief assistance',
            'Caste certificate issue', 'Income certificate request', 'Birth certificate help',
        ];

        $categories = ['general', 'grievance', 'scheme', 'project', 'personal'];
        $priorities  = ['low', 'medium', 'high', 'urgent'];
        $statuses    = ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'];

        // ── 60 Appointments ──────────────────────────────────────────────────
        for ($i = 1; $i <= 60; $i++) {
            $citizen   = $citizens->random();
            $village   = $villages->random();
            $status    = $statuses[array_rand($statuses)];
            $reqDate   = now()->subDays(rand(0, 45));
            $schedDate = $status === 'pending' ? null : $reqDate->copy()->addDays(rand(1, 7));

            Appointment::create([
                'appointment_number'  => 'APT' . str_pad($i, 5, '0', STR_PAD_LEFT),
                'citizen_name'        => $citizen->first_name . ' ' . $citizen->last_name,
                'citizen_mobile'      => $citizen->mobile_number,
                'citizen_village'     => $village->name,
                'citizen_mandal'      => $village->mandal?->name ?? 'Unknown',
                'citizen_id'          => $citizen->id,
                'constituency_id'     => $constituency?->id,
                'village_id'          => $village->id,
                'mandal_id'           => $village->mandal_id,
                'purpose'             => $purposes[array_rand($purposes)],
                'description'         => 'Citizen requires assistance regarding ' . strtolower($purposes[array_rand($purposes)]) . '.',
                'meeting_type'        => ['in_person', 'phone', 'video'][array_rand(['in_person', 'phone', 'video'])],
                'category'            => $categories[array_rand($categories)],
                'priority'            => $priorities[array_rand($priorities)],
                'status'              => $status,
                'requested_date'      => $reqDate->toDateString(),
                'requested_time'      => ['09:00', '10:30', '11:00', '14:00', '15:30'][array_rand(['09:00', '10:30', '11:00', '14:00', '15:30'])],
                'scheduled_date'      => $schedDate?->toDateString(),
                'scheduled_time'      => '10:00',
                'duration_minutes'    => [15, 30, 45, 60][array_rand([15, 30, 45, 60])],
                'venue'               => 'MP Office, Madhapur',
                'token_number'        => 'T' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'queue_position'      => $i,
                'assigned_officer_name' => 'Staff Officer',
                'follow_up_required'  => (bool) rand(0, 1),
                'satisfaction_rating' => $status === 'completed' ? rand(3, 5) : null,
                'created_via'         => ['office', 'portal', 'app'][array_rand(['office', 'portal', 'app'])],
                'created_by'          => $adminId,
                'created_at'          => $reqDate,
                'updated_at'          => $reqDate,
            ]);
        }

        // ── 10 Public Meetings ───────────────────────────────────────────────
        $meetingTitles = [
            'Town Hall — Madhapur Development Review',
            'Community Meeting — Water Supply Issues',
            'Stakeholder Meeting — MPLADS Projects',
            'Public Awareness — Ayushman Bharat Scheme',
            'Department Review — Roads & Buildings',
            'Town Hall — Employment & Youth',
            'Community Meeting — Agricultural Support',
            'Public Hearing — Land Acquisition',
            'Awareness Program — PM-KISAN Enrollment',
            'Village Development Meeting — Kondapur',
        ];

        foreach ($meetingTitles as $i => $title) {
            $mDate   = now()->addDays(rand(-20, 30));
            $village = $villages->random();

            PublicMeeting::create([
                'meeting_number'      => 'PM' . str_pad($i + 1, 4, '0', STR_PAD_LEFT),
                'title'               => $title,
                'description'         => 'A community gathering to discuss local issues and government schemes.',
                'meeting_type'        => ['town_hall', 'community_meeting', 'department_review', 'stakeholder_meeting', 'awareness_program'][$i % 5],
                'status'              => $mDate->isPast() ? 'completed' : 'scheduled',
                'venue'               => 'Community Hall, ' . $village->name,
                'venue_address'       => $village->name . ', ' . ($village->mandal?->name ?? 'Hyderabad'),
                'constituency_id'     => $constituency?->id,
                'mandal_id'           => $village->mandal_id,
                'village_id'          => $village->id,
                'meeting_date'        => $mDate->toDateString(),
                'start_time'          => '10:00:00',
                'end_time'            => '13:00:00',
                'expected_attendance' => rand(50, 500),
                'actual_attendance'   => $mDate->isPast() ? rand(40, 450) : null,
                'agenda_items'        => ['Opening remarks', 'Issue presentation', 'Q&A session', 'Resolution summary'],
                'topics_discussed'    => $mDate->isPast() ? ['Water supply', 'Road conditions', 'Scheme benefits'] : null,
                'key_outcomes'        => $mDate->isPast() ? 'Decisions made on key issues. Follow-up actions assigned.' : null,
                'chief_guest'         => 'Hon. MP Ravi Varma',
                'organized_by'        => $adminId,
                'created_by'          => $adminId,
                'created_at'          => now()->subDays(rand(1, 30)),
                'updated_at'          => now()->subDays(rand(0, 10)),
            ]);
        }

        // ── 8 MP Tours ────────────────────────────────────────────────────────
        $tourTitles = [
            'Madhapur Constituency Development Tour',
            'Kondapur Village Inspection Visit',
            'MPLADS Project Review — North Zone',
            'Agricultural Support Field Survey',
            'Flood Relief Inspection — Affected Villages',
            'Youth Employment Programme Launch',
            'School Infrastructure Review Tour',
            'Health Camp Inauguration Tour',
        ];

        foreach ($tourTitles as $i => $title) {
            $sDate   = now()->addDays(rand(-30, 30));
            $eDate   = $sDate->copy()->addDays(rand(1, 3));

            MpTour::create([
                'tour_number'    => 'TOUR' . str_pad($i + 1, 4, '0', STR_PAD_LEFT),
                'title'          => $title,
                'objectives'     => 'Review ongoing development activities and address citizen concerns.',
                'tour_type'      => ['constituency_visit', 'inspection', 'project_inspection', 'field_survey'][$i % 4],
                'status'         => $sDate->isPast() ? 'completed' : ($sDate->isToday() ? 'ongoing' : 'planned'),
                'start_date'     => $sDate->toDateString(),
                'end_date'       => $eDate->toDateString(),
                'departure_time' => '07:00:00',
                'constituency_id'=> $constituency?->id,
                'mandals_covered'=> $mandals->take(rand(2, 4))->pluck('name')->toArray(),
                'villages_count' => rand(3, 12),
                'citizens_met'   => $sDate->isPast() ? rand(50, 500) : 0,
                'key_outcomes'   => $sDate->isPast() ? 'Inspected ' . rand(2, 8) . ' projects. Noted issues for follow-up.' : null,
                'commitments_made'=> $sDate->isPast() ? 'Road repair in 30 days. Water supply restoration by next month.' : null,
                'created_by'     => $adminId,
                'created_at'     => now()->subDays(rand(1, 60)),
                'updated_at'     => now()->subDays(rand(0, 10)),
            ]);
        }

        // ── 8 Janata Darbar Sessions ──────────────────────────────────────────
        for ($i = 1; $i <= 8; $i++) {
            $sDate  = now()->addDays(rand(-60, 30));
            $mandal = $mandals->random();
            $village = $villages->where('mandal_id', $mandal->id)->first() ?? $villages->first();

            $session = JanataDarbarSession::create([
                'session_number'    => 'JD' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'title'             => 'Janata Darbar Session — ' . $mandal->name . ' #' . $i,
                'description'       => 'Open-house session for citizens to present grievances directly to the MP.',
                'status'            => $sDate->isPast() ? 'completed' : 'scheduled',
                'venue'             => 'Mandal Office, ' . $mandal->name,
                'constituency_id'   => $constituency?->id,
                'mandal_id'         => $mandal->id,
                'village_id'        => $village->id,
                'session_date'      => $sDate->toDateString(),
                'start_time'        => '09:00:00',
                'end_time'          => '13:00:00',
                'max_registrations' => 200,
                'registered_citizens' => rand(80, 200),
                'actual_attendance'   => $sDate->isPast() ? rand(60, 180) : 0,
                'token_counter'       => rand(80, 200),
                'issues_raised'       => $sDate->isPast() ? rand(40, 150) : 0,
                'issues_resolved'     => $sDate->isPast() ? rand(20, 80) : 0,
                'issues_referred'     => $sDate->isPast() ? rand(10, 40) : 0,
                'issues_pending'      => $sDate->isPast() ? rand(5, 30) : 0,
                'main_topics'         => ['Water supply', 'Road repair', 'Pension', 'PMAY', 'Employment'],
                'key_outcomes'        => $sDate->isPast() ? rand(20, 80) . ' issues resolved on-site. ' . rand(10, 40) . ' referred to departments.' : null,
                'presided_by'         => $adminId,
                'created_by'          => $adminId,
                'created_at'          => now()->subDays(rand(1, 70)),
                'updated_at'          => now()->subDays(rand(0, 10)),
            ]);

            // Add sample meeting notes
            MeetingNote::create([
                'notable_type'  => JanataDarbarSession::class,
                'notable_id'    => $session->id,
                'title'         => 'Key Issues from Session ' . $i,
                'content'       => 'Citizens raised concerns about water supply, road conditions, and pending scheme benefits. Action items assigned to respective departments.',
                'note_type'     => 'discussion',
                'priority'      => 'high',
                'is_private'    => false,
                'is_completed'  => $sDate->isPast(),
                'created_by'    => $adminId,
            ]);
        }

        $this->command->info('Meeting data seeded: 60 appointments, 10 public meetings, 8 tours, 8 Janata Darbar sessions');
    }
}
