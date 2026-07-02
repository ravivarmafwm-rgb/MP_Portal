<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\Citizen;
use App\Models\CitizenAddress;
use App\Models\Family;
use App\Models\FamilyMember;
use App\Models\GrievanceCategory;
use App\Models\Grievance;
use App\Models\Project;
use App\Models\Role;
use App\Models\Scheme;
use App\Models\SchemeApplication;
use App\Models\Survey;
use App\Models\SurveyQuestion;
use App\Models\SurveyResponse;
use App\Models\User;
use App\Models\Village;
use App\Models\Volunteer;
use App\Models\Constituency;
use App\Models\Ward;
use App\Models\PollingBooth;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DashboardDataSeeder extends Seeder
{
    private User $adminUser;
    private array $villageIds   = [];
    private array $wardIds      = [];
    private array $boothIds     = [];

    public function run(): void
    {
        $this->adminUser  = User::where('email', 'admin@mpdashboard.com')->first();
        $this->villageIds = Village::pluck('id')->toArray();
        $this->wardIds    = Ward::pluck('id')->toArray();
        $this->boothIds   = PollingBooth::pluck('id')->toArray();

        if (empty($this->villageIds)) {
            $this->command->warn('No villages found — skipping dashboard data seeding.');
            return;
        }

        $this->command->info('Seeding families and citizens...');
        $this->seedFamiliesAndCitizens(400);

        $this->command->info('Seeding volunteers...');
        $this->seedVolunteers();

        $this->command->info('Seeding grievances...');
        $this->seedGrievances();

        $this->command->info('Seeding projects...');
        $this->seedProjects();

        $this->command->info('Seeding scheme applications...');
        $this->seedSchemeApplications();

        $this->command->info('Seeding surveys...');
        $this->seedSurveys();

        $this->command->info('Seeding activity logs...');
        $this->seedActivityLogs();

        $this->command->info('Dashboard data seeded successfully!');
    }

    // ─── Families & Citizens ───────────────────────────────────────────────────
    private function seedFamiliesAndCitizens(int $count): void
    {
        $firstNames  = ['Ravi','Suresh','Priya','Anjali','Ramesh','Kavitha','Krishna',
                        'Sunita','Vijay','Lakshmi','Mohan','Deepa','Arjun','Sita','Ganesh'];
        $lastNames   = ['Reddy','Sharma','Kumar','Rao','Singh','Naidu','Varma','Devi'];
        $religions   = ['Hindu','Muslim','Christian','Sikh'];
        $ratCards    = ['APL','BPL','AAY'];
        $occupations = ['Farmer','Business','Government Employee','Private Employee','Daily Wage'];

        for ($i = 0; $i < $count; $i++) {
            $lastName  = $lastNames[array_rand($lastNames)];
            $villageId = $this->villageIds[array_rand($this->villageIds)];
            $wardId    = !empty($this->wardIds)  ? $this->wardIds[array_rand($this->wardIds)]   : null;
            $boothId   = !empty($this->boothIds) ? $this->boothIds[array_rand($this->boothIds)] : null;

            $family = Family::create([
                'family_id'           => 'FAM' . str_pad($i + 1, 7, '0', STR_PAD_LEFT),
                'head_of_family_name' => $firstNames[array_rand($firstNames)] . ' ' . $lastName,
                'village_id'          => $villageId,
                'ward_id'             => $wardId,
                'polling_booth_id'    => $boothId,
                'ration_card_number'  => 'RC' . str_pad(rand(1, 99999), 8, '0', STR_PAD_LEFT),
                'ration_card_type'    => $ratCards[array_rand($ratCards)],
                'is_bpl'              => rand(0, 3) === 0,
                'members_count'       => rand(2, 6),
                'annual_income'       => (string) rand(80000, 800000),
                'caste'               => ['General','OBC','SC','ST'][rand(0, 3)],
                'religion'            => $religions[array_rand($religions)],
                'created_by'          => $this->adminUser->id,
            ]);

            // 2–4 citizens per family
            $memberCount = rand(2, 4);
            for ($j = 0; $j < $memberCount; $j++) {
                $firstName = $firstNames[array_rand($firstNames)];
                $dob       = now()->subYears(rand(18, 70))->subDays(rand(0, 365))->toDateString();

                $citizen = Citizen::create([
                    'unique_id'        => 'CIT' . strtoupper(Str::random(8)),
                    'first_name'       => $firstName,
                    'last_name'        => $lastName,
                    'date_of_birth'    => $dob,
                    'gender'           => ['Male','Female'][rand(0, 1)],
                    'voter_id'         => 'VT' . strtoupper(Str::random(10)),
                    'aadhaar_number'   => (string) rand(100000000000, 999999999999),
                    'mobile_number'    => '9' . rand(100000000, 999999999),
                    'occupation'       => $occupations[array_rand($occupations)],
                    'is_voter'         => true,
                    'created_by'       => $this->adminUser->id,
                ]);

                // Link to family
                FamilyMember::create([
                    'family_id'              => $family->id,
                    'citizen_id'             => $citizen->id,
                    'relationship_with_head' => $j === 0 ? 'Self' : ['Spouse','Son','Daughter','Parent'][rand(0, 3)],
                    'is_head'                => $j === 0,
                    'created_by'             => $this->adminUser->id,
                ]);

                // Primary address
                CitizenAddress::create([
                    'citizen_id'       => $citizen->id,
                    'address_type'     => 'permanent',
                    'village_id'       => $villageId,
                    'ward_id'          => $wardId,
                    'polling_booth_id' => $boothId,
                    'pincode'          => (string) rand(500001, 509999),
                    'district'         => 'Hyderabad',
                    'state'            => 'Telangana',
                    'is_primary'       => true,
                    'created_by'       => $this->adminUser->id,
                ]);
            }
        }
    }

    // ─── Volunteers ────────────────────────────────────────────────────────────
    private function seedVolunteers(): void
    {
        $volunteerData = [
            ['Suresh',  'Reddy',   1248, 86, 142],
            ['Priya',   'N',       1102, 74, 121],
            ['Rakesh',  'Varma',   980,  68, 109],
            ['Anjali',  'Devi',    912,  64, 98],
            ['Ramesh',  'Kumar',   845,  58, 91],
            ['Venkat',  'Rao',     780,  52, 85],
            ['Meena',   'S',       720,  48, 79],
            ['Rajesh',  'Kumar',   695,  45, 74],
            ['Sunita',  'Varma',   660,  42, 68],
            ['Anil',    'Sharma',  625,  38, 62],
        ];

        $volunteerRole = Role::where('slug', 'volunteer')->first();

        foreach ($volunteerData as $idx => [$firstName, $lastName, $score, $activities, $hours]) {
            $email = strtolower("{$firstName}.{$lastName}{$idx}@volunteer.mp");

            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name'     => "$firstName $lastName",
                    'password' => bcrypt('Volunteer@1234'),
                    'role_id'  => $volunteerRole?->id,
                ]
            );

            Volunteer::create([
                'user_id'           => $user->id,
                'volunteer_id'      => 'VOL' . str_pad($idx + 1, 6, '0', STR_PAD_LEFT),
                'first_name'        => $firstName,
                'last_name'         => $lastName,
                'date_of_birth'     => now()->subYears(rand(22, 45))->toDateString(),
                'gender'            => ['Male','Female'][rand(0, 1)],
                'mobile_number'     => '9' . rand(100000000, 999999999),
                'village_id'        => $this->villageIds[array_rand($this->villageIds)],
                'volunteer_type'    => 'booth',
                'joining_date'      => now()->subMonths(rand(3, 18))->toDateString(),
                'status'            => 'active',
                'performance_score' => round($score / 10, 2),
                'total_activities'  => $activities,
                'total_hours'       => $hours,
                'is_available'      => true,
                'created_by'        => $this->adminUser->id,
            ]);
        }
    }

    // ─── Grievances ────────────────────────────────────────────────────────────
    private function seedGrievances(): void
    {
        $categories = GrievanceCategory::all();
        if ($categories->isEmpty()) return;

        $statuses  = ['pending','pending','pending','assigned','in_progress','resolved','resolved','resolved','escalated','closed'];
        $priorities= ['low','medium','high','urgent'];
        $sources   = ['manual','portal','phone','field'];
        $citizens  = Citizen::limit(200)->get();

        $descriptions = [
            'Road has deep potholes causing accidents near the school',
            'No water supply for the past 5 days in our colony',
            'PHC doctor absent for weeks — urgent medical need',
            'School building roof is leaking, dangerous for students',
            'Pension amount not credited for 3 months',
            'Street light broken for 2 months near bus stop',
            'Drainage overflow causing health hazard',
            'PMAY-G house approval pending since last year',
            'Ration shop not distributing full quota',
            'Borewell water is contaminated — residents falling sick',
        ];

        $num = 1;
        foreach ($categories as $category) {
            for ($i = 0; $i < 50; $i++) {
                $citizen = $citizens->isNotEmpty() ? $citizens->random() : null;

                Grievance::create([
                    'grievance_number'    => 'GRV' . str_pad($num++, 8, '0', STR_PAD_LEFT),
                    'category_id'         => $category->id,
                    'citizen_id'          => $citizen?->id,
                    'citizen_name'        => $citizen ? ($citizen->first_name . ' ' . $citizen->last_name) : 'Anonymous',
                    'citizen_mobile'      => $citizen?->mobile_number ?? '9000000000',
                    'subject'             => $descriptions[array_rand($descriptions)],
                    'description'         => 'Citizen has reported this issue and requires urgent attention from concerned department.',
                    'priority'            => $priorities[array_rand($priorities)],
                    'severity'            => ['low','medium','high'][rand(0, 2)],
                    'status'              => $statuses[array_rand($statuses)],
                    'source'              => $sources[array_rand($sources)],
                    'village_id'          => $this->villageIds[array_rand($this->villageIds)],
                    'ward_id'             => !empty($this->wardIds) ? $this->wardIds[array_rand($this->wardIds)] : null,
                    'is_anonymous'        => rand(0, 5) === 0,
                    'created_by'          => $this->adminUser->id,
                    'created_at'          => now()->subDays(rand(0, 90)),
                    'updated_at'          => now()->subDays(rand(0, 30)),
                ]);
            }
        }
    }

    // ─── Projects ──────────────────────────────────────────────────────────────
    private function seedProjects(): void
    {
        $constituency = Constituency::first();

        $projects = [
            ['name' => 'Rural Road #18 — Sector 7',   'type' => 'Roads',     'cat' => 'Infrastructure', 'budget' => 42000000, 'spent' => 30240000, 'pct' => 72, 'status' => 'in_progress',  'due' => '2026-09-30'],
            ['name' => 'Govt. School Upgrade',         'type' => 'Education', 'cat' => 'Social',         'budget' => 18000000, 'spent' => 8640000,  'pct' => 48, 'status' => 'delayed',      'due' => '2026-08-31'],
            ['name' => 'Community Hospital — Phase 2', 'type' => 'Health',    'cat' => 'Social',         'budget' => 96000000, 'spent' => 33600000, 'pct' => 35, 'status' => 'in_progress',  'due' => '2027-03-31'],
            ['name' => 'Drinking Water Pipeline',      'type' => 'Water',     'cat' => 'Infrastructure', 'budget' => 21000000, 'spent' => 19110000, 'pct' => 91, 'status' => 'in_progress',  'due' => '2026-07-31'],
            ['name' => 'Solar Street Lights Install',  'type' => 'Power',     'cat' => 'Infrastructure', 'budget' => 8500000,  'spent' => 6800000,  'pct' => 80, 'status' => 'in_progress',  'due' => '2026-08-15'],
            ['name' => 'Community Hall Construction',  'type' => 'Community', 'cat' => 'Social',         'budget' => 12000000, 'spent' => 2400000,  'pct' => 20, 'status' => 'in_progress',  'due' => '2027-01-31'],
            ['name' => 'PHC Upgrade — Kondapur',       'type' => 'Health',    'cat' => 'Social',         'budget' => 6500000,  'spent' => 6175000,  'pct' => 95, 'status' => 'in_progress',  'due' => '2026-07-15'],
        ];

        foreach ($projects as $idx => $data) {
            Project::create([
                'project_number'            => 'PRJ' . str_pad($idx + 1, 6, '0', STR_PAD_LEFT),
                'name'                      => $data['name'],
                'project_type'              => $data['type'],
                'category'                  => $data['cat'],
                'constituency_id'           => $constituency?->id,
                'mandal_id'                 => null,
                'village_id'                => $this->villageIds[array_rand($this->villageIds)],
                'estimated_cost'            => $data['budget'],
                'sanctioned_amount'         => $data['budget'],
                'expenditure'               => $data['spent'],
                'progress_percentage'       => $data['pct'],
                'status'                    => $data['status'],
                'start_date'                => now()->subMonths(rand(3, 12))->toDateString(),
                'scheduled_completion_date' => $data['due'],
                'description'               => 'Government funded project under MPLADS scheme.',
                'location'                  => $this->villageIds[array_rand($this->villageIds)] ? 'Hyderabad' : 'Telangana',
                'created_by'                => $this->adminUser->id,
            ]);
        }
    }

    // ─── Scheme Applications ───────────────────────────────────────────────────
    private function seedSchemeApplications(): void
    {
        $schemes  = Scheme::pluck('id')->toArray();
        $citizens = Citizen::limit(400)->get();
        $statuses = ['pending','pending','under_review','approved','approved','approved','rejected','disbursed'];

        if (empty($schemes) || $citizens->isEmpty()) return;

        for ($i = 0; $i < 400; $i++) {
            $citizen = $citizens->random();

            SchemeApplication::create([
                'application_number' => 'APP' . str_pad($i + 1, 8, '0', STR_PAD_LEFT),
                'scheme_id'          => $schemes[array_rand($schemes)],
                'citizen_id'         => $citizen->id,
                'applicant_name'     => $citizen->first_name . ' ' . $citizen->last_name,
                'applicant_mobile'   => $citizen->mobile_number ?? '9000000000',
                'village_id'         => $this->villageIds[array_rand($this->villageIds)],
                'status'             => $statuses[array_rand($statuses)],
                'application_date'   => now()->subDays(rand(0, 180))->toDateString(),
                'created_by'         => $this->adminUser->id,
            ]);
        }
    }

    // ─── Surveys ──────────────────────────────────────────────────────────────
    private function seedSurveys(): void
    {
        $constituency = Constituency::first();
        $volunteer    = Volunteer::first();

        $surveyList = [
            ['title' => 'Employment Survey 2026',  'desc' => '62% youth seek IT-skill programs',        'code' => 'SRV-EMP-2026'],
            ['title' => 'Farmers Survey 2026',     'desc' => 'Drip irrigation top requested aid',       'code' => 'SRV-FRM-2026'],
            ['title' => 'Housing Survey 2026',     'desc' => '3,210 await PMAY-G sanction',             'code' => 'SRV-HSG-2026'],
            ['title' => 'Health Survey 2026',      'desc' => 'Diabetes screening top concern',          'code' => 'SRV-HLT-2026'],
        ];

        foreach ($surveyList as $surveyData) {
            $survey = Survey::create([
                'survey_code'       => $surveyData['code'],
                'title'             => $surveyData['title'],
                'description'       => $surveyData['desc'],
                'category'          => 'community',
                'status'            => 'active',
                'constituency_id'   => $constituency?->id,
                'start_date'        => now()->subMonths(2)->toDateString(),
                'end_date'          => now()->addMonths(1)->toDateString(),
                'created_by'        => $this->adminUser->id,
                'is_active'         => true,
                'total_responses'   => 0,
            ]);

            // Add a sample question
            SurveyQuestion::create([
                'survey_id'     => $survey->id,
                'question_text' => 'What is your primary concern in the constituency?',
                'question_type' => 'multiple_choice',
                'options'       => json_encode(['Roads','Water','Health','Education','Employment','Other']),
                'is_required'   => true,
                'sort_order'    => 1,
                'created_by'    => $this->adminUser->id,
            ]);

            // Add 15–25 survey responses
            $citizens = Citizen::inRandomOrder()->limit(20)->get();
            foreach ($citizens as $citizen) {
                SurveyResponse::create([
                    'survey_id'        => $survey->id,
                    'citizen_id'       => $citizen->id,
                    'volunteer_id'     => $volunteer?->id,
                    'village_id'       => $this->villageIds[array_rand($this->villageIds)],
                    'respondent_name'  => $citizen->first_name . ' ' . $citizen->last_name,
                    'respondent_mobile'=> $citizen->mobile_number,
                    'response_date'    => now()->subDays(rand(0, 60))->toDateString(),
                    'status'           => 'completed',
                    'created_by'       => $this->adminUser->id,
                ]);
            }

            // Update response count
            $survey->update(['total_responses' => $survey->responses()->count()]);
        }
    }

    // ─── Activity Logs ─────────────────────────────────────────────────────────
    private function seedActivityLogs(): void
    {
        $logs = [
            ['action' => 'grievance_filed',    'desc' => 'Booth 142 — Filed new grievance: water supply',      'ago' => 120],
            ['action' => 'scheme_application', 'desc' => 'PMAY-G — 32 new applications received',             'ago' => 1080],
            ['action' => 'citizen_verified',   'desc' => 'S. Reddy — Marked 24 citizens verified',            'ago' => 3600],
            ['action' => 'project_updated',    'desc' => 'Rural Road #18 — Phase 2 marked complete',          'ago' => 10800],
            ['action' => 'survey_response',    'desc' => 'Survey 2026-Q2 — 184 responses submitted today',    'ago' => 18000],
            ['action' => 'volunteer_assigned', 'desc' => 'New volunteer assigned to Kondapur mandal',          'ago' => 86400],
            ['action' => 'grievance_resolved', 'desc' => 'Water complaint Sector 7 — resolved by PWD',        'ago' => 172800],
            ['action' => 'project_milestone',  'desc' => 'Community Hospital — Foundation work completed',    'ago' => 259200],
        ];

        foreach ($logs as $log) {
            ActivityLog::create([
                'user_id'       => $this->adminUser->id,
                'action'        => $log['action'],
                'description'   => $log['desc'],
                'module'        => 'system',
                'ip_address'    => '127.0.0.1',
                'created_at'    => now()->subSeconds($log['ago']),
                'updated_at'    => now()->subSeconds($log['ago']),
            ]);
        }
    }
}
