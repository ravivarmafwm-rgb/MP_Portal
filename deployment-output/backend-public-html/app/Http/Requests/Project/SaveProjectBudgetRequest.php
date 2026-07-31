<?php
namespace App\Http\Requests\Project;
use App\Models\Project;use Illuminate\Foundation\Http\FormRequest;
class SaveProjectBudgetRequest extends FormRequest { public function authorize():bool{$project=Project::find($this->route('project'));return $project&&($this->user()?->can('update',$project)??false);} public function rules():array{return ['budget_head'=>['required','string','min:2','max:255'],'description'=>['nullable','string','max:10000'],'allocated_amount'=>['required','numeric','min:0'],'revised_amount'=>['nullable','numeric','min:0'],'utilized_amount'=>['required','numeric','min:0'],'status'=>['required','in:active,closed,suspended'],'allocation_date'=>['nullable','date'],'remarks'=>['nullable','string','max:10000']];} }
