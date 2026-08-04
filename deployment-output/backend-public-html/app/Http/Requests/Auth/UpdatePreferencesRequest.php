<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePreferencesRequest extends FormRequest
{
    public function authorize(): bool { return $this->user() !== null; }

    public function rules(): array
    {
        return [
            'theme' => ['sometimes', 'in:light,dark,system'],
            'language' => ['sometimes', 'in:en,te,hi'],
            'timezone' => ['sometimes', 'timezone'],
            'session_timeout' => ['sometimes', 'in:0,30,60,120,240,480'],
            'notif_email' => ['sometimes', 'boolean'],
            'notif_sms' => ['sometimes', 'boolean'],
            'notif_browser' => ['sometimes', 'boolean'],
            'notif_grievance_updates' => ['sometimes', 'boolean'],
            'notif_scheme_updates' => ['sometimes', 'boolean'],
            'notif_project_updates' => ['sometimes', 'boolean'],
            'email_daily_summary' => ['sometimes', 'boolean'],
            'email_weekly_report' => ['sometimes', 'boolean'],
            'email_critical_alerts' => ['sometimes', 'boolean'],
            'password_expiry_days' => ['sometimes', 'in:0,30,60,90,180'],
            'require_2fa_prompt' => ['sometimes', 'boolean'],
        ];
    }
}
