<?php
namespace App\Http\Requests\Communication;
use Illuminate\Foundation\Http\FormRequest; use Illuminate\Validation\Rule;
class RecordCommunicationConsentRequest extends FormRequest { public function authorize():bool{return $this->user()?->hasPermission('communications.manage')??false;} public function rules():array{return ['contact_type'=>['required',Rule::in(['citizen','volunteer','department'])],'contact_id'=>['required','uuid'],'channel'=>['required',Rule::in(['sms','whatsapp','email','voice'])],'purpose'=>['required','string','max:100'],'is_granted'=>['required','boolean'],'source'=>['required',Rule::in(['written','digital','verbal_recorded','imported'])],'proof_reference'=>['required','string','max:500']];} }
