<?php
namespace App\Http\Resources;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
class ProjectWorkflowEntryResource extends JsonResource { public function toArray(Request $request): array { return ['id'=>$this->id,'project_id'=>$this->project_id,'entry_type'=>$this->entry_type,'title'=>$this->title,'reference_number'=>$this->reference_number,'status'=>$this->status,'department'=>$this->department,'agency'=>$this->agency,'contractor'=>$this->contractor,'amount'=>$this->amount,'entry_date'=>$this->entry_date?->toDateString(),'due_date'=>$this->due_date?->toDateString(),'physical_progress'=>$this->physical_progress,'financial_progress'=>$this->financial_progress,'latitude'=>$this->latitude,'longitude'=>$this->longitude,'notes'=>$this->notes,'details'=>$this->details,'created_by'=>$this->created_by,'created_at'=>$this->created_at]; } }
