<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Models\CommunicationCampaign;
use App\Services\CommunicationCampaignDispatcher;
use App\Services\GrievanceEscalationService;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::call(function () {
    CommunicationCampaign::where('status','approved')->whereNotNull('scheduled_at')->where('scheduled_at','<=',now())->orderBy('scheduled_at')->limit(25)->get()->each(function($campaign){try{app(CommunicationCampaignDispatcher::class)->dispatch($campaign);}catch(\Throwable $exception){$campaign->update(['status'=>'failed']);report($exception);}});
})->everyMinute()->name('dispatch-scheduled-communications')->withoutOverlapping();

Schedule::call(fn () => app(GrievanceEscalationService::class)->processOverdue())
    ->everyFifteenMinutes()
    ->name('escalate-overdue-grievances')
    ->withoutOverlapping();
