<?php

namespace App\Services;

use App\Models\CommunicationRecipient;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use RuntimeException;

class CommunicationDeliveryService
{
    public function deliver(CommunicationRecipient $recipient): array
    {
        $campaign = $recipient->campaign()->with('template')->firstOrFail();
        $message = $this->render($campaign->body, $recipient->variables ?? []);
        $subject = $this->render((string) $campaign->subject, $recipient->variables ?? []);

        return match ($campaign->channel) {
            'email' => $this->email($recipient->destination, $subject, $message),
            'sms' => $this->sms($recipient, $message),
            'whatsapp' => $this->whatsapp($recipient, $message),
            'voice' => $this->voice($recipient, $message),
            default => throw new RuntimeException('Unsupported communication channel.'),
        };
    }

    private function email(string $destination, string $subject, string $message): array
    {
        if (config('mail.default') === 'log' || config('mail.default') === 'array') throw new RuntimeException('A real email transport must be configured before delivery.');
        Mail::raw($message, fn ($mail) => $mail->to($destination)->subject($subject));
        return ['provider_message_id' => null, 'response' => ['accepted' => true, 'transport' => config('mail.default')]];
    }

    private function sms(CommunicationRecipient $recipient, string $message): array
    {
        $endpoint=config('communications.sms.endpoint');$token=config('communications.sms.token');$sender=config('communications.sms.sender_id');
        if(!$endpoint||!$token||!$sender)throw new RuntimeException('SMS provider endpoint, token and sender ID are not configured.');
        $template=$recipient->campaign->template;
        if(!$template?->dlt_template_id)throw new RuntimeException('An approved DLT template ID is required for SMS delivery.');
        $response=Http::withToken($token)->acceptJson()->timeout(config('communications.sms.timeout'))->post($endpoint,['to'=>$recipient->destination,'message'=>$message,'sender_id'=>$sender,'dlt_template_id'=>$template->dlt_template_id,'dlt_entity_id'=>$template->dlt_entity_id]);
        if(!$response->successful())throw new RuntimeException('SMS provider rejected the message with HTTP '.$response->status().'.');
        $json=$response->json();return ['provider_message_id'=>data_get($json,'message_id')??data_get($json,'id'),'response'=>$this->safeResponse($json)];
    }

    private function whatsapp(CommunicationRecipient $recipient, string $message): array
    {
        $endpoint=config('communications.whatsapp.endpoint');$token=config('communications.whatsapp.token');$phoneId=config('communications.whatsapp.phone_number_id');
        if(!$endpoint||!$token||!$phoneId)throw new RuntimeException('WhatsApp provider endpoint, token and phone number ID are not configured.');
        $template=$recipient->campaign->template;if(!$template?->provider_template_id)throw new RuntimeException('An approved WhatsApp provider template is required.');
        $parameters=array_map(fn($value)=>['type'=>'text','text'=>(string)$value],array_values($recipient->variables??[]));$templatePayload=['name'=>$template->provider_template_id,'language'=>['code'=>'en']];if($parameters)$templatePayload['components']=[['type'=>'body','parameters'=>$parameters]];$response=Http::withToken($token)->acceptJson()->timeout(config('communications.whatsapp.timeout'))->post(rtrim($endpoint,'/').'/'.$phoneId.'/messages',['messaging_product'=>'whatsapp','to'=>$recipient->destination,'type'=>'template','template'=>$templatePayload]);
        if(!$response->successful())throw new RuntimeException('WhatsApp provider rejected the message with HTTP '.$response->status().'.');
        $json=$response->json();return ['provider_message_id'=>data_get($json,'messages.0.id'),'response'=>$this->safeResponse($json)];
    }

    private function voice(CommunicationRecipient $recipient, string $message): array
    {
        $endpoint=config('communications.voice.endpoint');$token=config('communications.voice.token');$caller=config('communications.voice.caller_id');$template=$recipient->campaign->template;
        if(!$endpoint||!$token||!$caller)throw new RuntimeException('Voice provider endpoint, token and caller ID are not configured.');
        if(!$template?->provider_template_id)throw new RuntimeException('An approved voice or IVR provider template is required.');
        $response=Http::withToken($token)->acceptJson()->timeout(config('communications.voice.timeout'))->post($endpoint,['to'=>$recipient->destination,'caller_id'=>$caller,'template_id'=>$template->provider_template_id,'purpose'=>$recipient->campaign->purpose,'variables'=>$recipient->variables,'fallback_text'=>$message]);
        if(!$response->successful())throw new RuntimeException('Voice provider rejected the call with HTTP '.$response->status().'.');
        $json=$response->json();return ['provider_message_id'=>data_get($json,'call_id')??data_get($json,'id'),'response'=>$this->safeResponse($json)];
    }

    private function render(string $text,array $variables):string{foreach($variables as $key=>$value)$text=str_replace('{{'.$key.'}}',(string)$value,$text);if(preg_match('/{{[^}]+}}/',$text))throw new RuntimeException('The message contains unresolved template variables.');return$text;}
    private function safeResponse(mixed $response):array{return is_array($response)?array_intersect_key($response,array_flip(['id','call_id','message_id','messages','status','success'])):[];}
}
