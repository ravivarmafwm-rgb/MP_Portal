<?php
namespace App\Http\Requests\Project;
use Illuminate\Foundation\Http\FormRequest;
class StoreProjectRequest extends FormRequest {
 public function authorize():bool{return $this->user()?->can('create',\App\Models\Project::class)??false;}
 public function rules():array{return [
  'name'=>['required','string','min:3','max:255'],'project_type'=>['nullable','string','max:100'],'project_type_id'=>['nullable','uuid','exists:project_types,id'],'category'=>['nullable','string','max:100'],'project_category_id'=>['nullable','uuid','exists:project_categories,id'],
  'description'=>['nullable','string','max:10000'],'objectives'=>['nullable','string','max:10000'],'estimated_cost'=>['required','numeric','min:0'],
  'sanctioned_amount'=>['nullable','numeric','min:0'],'sanction_date'=>['nullable','date'],'sanction_order_number'=>['nullable','string','max:100'],
  'start_date'=>['nullable','date'],'scheduled_completion_date'=>['nullable','date','after_or_equal:start_date'],'status'=>['nullable','in:proposed,approved,in_progress,completed,delayed,at_risk,cancelled'],
  'constituency_id'=>['nullable','uuid','exists:constituencies,id'],'assembly_constituency_id'=>['nullable','uuid','exists:assembly_constituencies,id'],
  'mandal_id'=>['nullable','uuid','exists:mandals,id'],'village_id'=>['required','uuid','exists:villages,id'],'ward_id'=>['nullable','uuid','exists:wards,id'],
  'contractor_id'=>['nullable','uuid','exists:contractors,id'],'location'=>['nullable','string','max:500'],'department'=>['nullable','string','max:255'],'department_id'=>['nullable','uuid','exists:departments,id'],'agency_id'=>['nullable','uuid','exists:project_agencies,id'],
  'latitude'=>['nullable','numeric','between:-90,90'],'longitude'=>['nullable','numeric','between:-180,180'],'remarks'=>['nullable','string','max:10000'],
 ];}
}
