<?php
namespace App\Http\Requests\Project;
class UpdateProjectRequest extends StoreProjectRequest {
 public function authorize():bool{$project=\App\Models\Project::find($this->route('project'));return $project&&($this->user()?->can('update',$project)??false);}
 public function rules():array{$rules=parent::rules();foreach($rules as $key=>$value){$rules[$key]=array_values(array_filter($value,fn($rule)=>$rule!=='required'));array_unshift($rules[$key],'sometimes');}$rules['progress_percentage']=['sometimes','numeric','between:0,100'];$rules['expenditure']=['sometimes','numeric','min:0'];$rules['actual_completion_date']=['nullable','date','after_or_equal:start_date'];$rules['challenges']=['nullable','string','max:10000'];return $rules;}
}
