<?php
namespace App\Http\Requests\Project;
use Illuminate\Foundation\Http\FormRequest;
class SaveProjectWorkflowEntryRequest extends FormRequest {
 public function authorize(): bool { return $this->user()?->hasPermission('projects.manage') ?? false; }
 public function rules(): array { return ['entry_type'=>['required','in:work_order,administrative_sanction,technical_sanction,financial_sanction,tender,fund_release,expenditure,inspection,site_visit,approval'],'title'=>['required','string','max:255'],'reference_number'=>['nullable','string','max:100'],'status'=>['required','in:pending,submitted,approved,rejected,in_progress,completed,cancelled'],'department'=>['nullable','string','max:150'],'agency'=>['nullable','string','max:150'],'contractor'=>['nullable','string','max:150'],'amount'=>['nullable','numeric','min:0'],'entry_date'=>['nullable','date'],'due_date'=>['nullable','date','after_or_equal:entry_date'],'physical_progress'=>['nullable','numeric','min:0','max:100'],'financial_progress'=>['nullable','numeric','min:0','max:100'],'latitude'=>['nullable','numeric','between:-90,90'],'longitude'=>['nullable','numeric','between:-180,180'],'notes'=>['nullable','string','max:10000'],'details'=>['nullable','array']]; }
}
