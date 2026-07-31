<?php
namespace App\Http\Requests\Project;
use Illuminate\Foundation\Http\FormRequest;
class SaveProjectLookupRequest extends FormRequest { public function authorize(): bool { return $this->user()?->hasPermission('projects.manage') ?? false; } public function rules(): array { $rules=['name'=>['required','string','max:255'],'code'=>['required','string','max:80','alpha_dash'],'description'=>['nullable','string','max:2000'],'is_active'=>['sometimes','boolean']]; if($this->route('lookup')==='agency'){$rules['contact_person']=['nullable','string','max:255'];$rules['contact_email']=['nullable','email','max:255'];$rules['contact_phone']=['nullable','string','max:30'];} return $rules; } }
