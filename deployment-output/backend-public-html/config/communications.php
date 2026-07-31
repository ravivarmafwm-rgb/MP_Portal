<?php

return [
    'sms' => [
        'endpoint' => env('SMS_PROVIDER_ENDPOINT'),
        'token' => env('SMS_PROVIDER_TOKEN'),
        'sender_id' => env('SMS_SENDER_ID'),
        'timeout' => (int) env('SMS_PROVIDER_TIMEOUT', 15),
    ],
    'whatsapp' => [
        'endpoint' => env('WHATSAPP_PROVIDER_ENDPOINT'),
        'token' => env('WHATSAPP_PROVIDER_TOKEN'),
        'phone_number_id' => env('WHATSAPP_PHONE_NUMBER_ID'),
        'verify_token' => env('WHATSAPP_WEBHOOK_VERIFY_TOKEN'),
        'app_secret' => env('WHATSAPP_APP_SECRET'),
        'timeout' => (int) env('WHATSAPP_PROVIDER_TIMEOUT', 15),
    ],
    'voice' => [
        'endpoint' => env('VOICE_PROVIDER_ENDPOINT'),
        'token' => env('VOICE_PROVIDER_TOKEN'),
        'caller_id' => env('VOICE_CALLER_ID'),
        'timeout' => (int) env('VOICE_PROVIDER_TIMEOUT', 20),
    ],
    'webhook_secret' => env('COMMUNICATION_WEBHOOK_SECRET'),
];
