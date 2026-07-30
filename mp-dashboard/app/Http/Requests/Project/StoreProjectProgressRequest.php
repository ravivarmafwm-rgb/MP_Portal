<?php
namespace App\Http\Requests\Project;
use Illuminate\Foundation\Http\FormRequest;
class StoreProjectProgressRequest extends FormRequest {
 public function authorize():bool{$project=\App\Models\Project::find($this->route('project'));return $project&&($this->user()?->can('update',$project)??false);}
 public function rules():array{return ['progress_percentage'=>['required','numeric','between:0,100'],'expenditure'=>['required','numeric','min:0'],'work_done'=>['required','string','min:5','max:10000'],'challenges'=>['nullable','string','max:10000'],'next_steps'=>['nullable','string','max:10000'],'labour_count'=>['nullable','integer','min:0'],'machinery_count'=>['nullable','integer','min:0'],'latitude'=>['nullable','numeric','between:-90,90'],'longitude'=>['nullable','numeric','between:-180,180'],'update_date'=>['required','date','before_or_equal:today'],'status'=>['nullable','in:approved,in_progress,completed,delayed,at_risk']];}
}
