<?php
namespace App\Http\Requests\Survey;use Illuminate\Foundation\Http\FormRequest;
class AssignSurveyRequest extends FormRequest{public function authorize():bool{return$this->user()?->hasPermission('surveys.manage')??false;}public function rules():array{return['volunteer_ids'=>['required','array','min:1','max:500'],'volunteer_ids.*'=>['uuid','distinct','exists:volunteers,id'],'target_responses'=>['nullable','integer','min:1','max:1000000'],'due_date'=>['nullable','date','after_or_equal:today'],'remarks'=>['nullable','string','max:2000']];}}
