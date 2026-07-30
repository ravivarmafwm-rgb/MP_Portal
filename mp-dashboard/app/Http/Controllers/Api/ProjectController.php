<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Services\GeographicScopeService;
use App\Http\Requests\Project\StoreProjectRequest;
use App\Http\Requests\Project\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\Village;
use App\Models\Ward;
use Illuminate\Validation\ValidationException;
use App\Http\Requests\Project\StoreProjectProgressRequest;
use App\Models\ProjectUpdate;
use App\Models\ProjectMilestone;
use App\Models\ProjectBudget;
use App\Http\Requests\Project\SaveProjectMilestoneRequest;
use App\Http\Requests\Project\SaveProjectBudgetRequest;
use App\Http\Requests\Project\UploadProjectPhotoRequest;
use App\Models\ProjectPhoto;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Project::class);
        $query = Project::with(['constituency', 'village', 'contractor']);
        app(GeographicScopeService::class)->apply($query, $request->user());

        if ($search = $request->get('search')) {
            $query->where('name', 'ilike', "%$search%");
        }
        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }
        if ($type = $request->get('project_type')) {
            $query->where('project_type', $type);
        }

        $perPage = min((int) $request->get('per_page', 20), 100);
        $results = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'data' => $results->items(),
            'meta' => [
                'total' => $results->total(),
                'per_page' => $results->perPage(),
                'current_page' => $results->currentPage(),
                'last_page' => $results->lastPage(),
            ],
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $project = Project::with([
            'constituency', 'village', 'mandal', 'contractor',
            'milestones', 'updates', 'budgets', 'photos',
        ])->findOrFail($id);
        $this->authorize('view', $project);

        return response()->json($project);
    }

    public function stats(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Project::class);
        $base = Project::query();
        app(GeographicScopeService::class)->apply($base, $request->user());
        return response()->json([
            'total' => (clone $base)->count(), 'in_progress' => (clone $base)->where('status', 'in_progress')->count(),
            'completed' => (clone $base)->where('status', 'completed')->count(), 'delayed' => (clone $base)->where('status', 'delayed')->count(),
            'proposed' => (clone $base)->where('status', 'proposed')->count(), 'total_budget' => (float) (clone $base)->sum('sanctioned_amount'),
            'total_spent' => (float) (clone $base)->sum('expenditure'),
        ]);
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        $data=$this->normalizeLocation($request->validated());abort_unless(app(GeographicScopeService::class)->allowsVillage($request->user(),$data['village_id'],$data['ward_id']??null),403,'The selected project location is outside your assigned area.');
        $project=DB::transaction(function()use($data,$request){$project=Project::create([...$data,'project_number'=>'PRJ-'.now()->format('Y').'-'.strtoupper(Str::random(10)),'status'=>$data['status']??'proposed','created_by'=>$request->user()->id]);$this->audit($request,$project,'created',null,$project->getAttributes());return $project;});
        return response()->json(ProjectResource::make($project->load(['constituency','assemblyConstituency','mandal','village','ward','contractor']))->resolve(),201);
    }

    public function update(UpdateProjectRequest $request,string $id):JsonResponse
    {
        $project=Project::findOrFail($id);$this->authorize('update',$project);$data=$request->validated();if(isset($data['village_id'])||array_key_exists('ward_id',$data))$data=$this->normalizeLocation([...$project->only(['village_id','ward_id']),...$data]);$village=$data['village_id']??$project->village_id;$ward=$data['ward_id']??$project->ward_id;
        abort_unless(app(GeographicScopeService::class)->allowsVillage($request->user(),$village,$ward),403,'The selected project location is outside your assigned area.');
        if(isset($data['expenditure']))abort_if((float)$data['expenditure']>(float)($data['sanctioned_amount']??$project->sanctioned_amount??$project->estimated_cost),422,'Expenditure cannot exceed the sanctioned project amount.');
        $old=$project->getAttributes();DB::transaction(function()use($project,$data,$request,$old){$project->update([...$data,'updated_by'=>$request->user()->id]);$this->audit($request,$project,'updated',$old,$project->fresh()->getAttributes());});
        return response()->json(ProjectResource::make($project->fresh()->load(['constituency','assemblyConstituency','mandal','village','ward','contractor']))->resolve());
    }

    public function destroy(Request $request,string $id):JsonResponse
    {
        $project=Project::findOrFail($id);$this->authorize('delete',$project);abort_if($project->status==='completed'||(float)$project->expenditure>0,409,'Completed projects or projects with recorded expenditure cannot be deleted.');$old=$project->getAttributes();
        DB::transaction(function()use($project,$request,$old){$project->delete();$this->audit($request,$project,'deleted',$old,null);});return response()->json(['message'=>'Project deleted.']);
    }

    public function storeProgress(StoreProjectProgressRequest $request,string $id):JsonResponse
    {
        $project=Project::findOrFail($id);$this->authorize('update',$project);$data=$request->validated();
        if((float)$data['progress_percentage']<(float)$project->progress_percentage)throw ValidationException::withMessages(['progress_percentage'=>['Progress cannot be lower than the currently recorded percentage.']]);
        if((float)$data['expenditure']<(float)$project->expenditure)throw ValidationException::withMessages(['expenditure'=>['Cumulative expenditure cannot be lower than the currently recorded expenditure.']]);
        $limit=(float)($project->sanctioned_amount??$project->estimated_cost);if((float)$data['expenditure']>$limit)throw ValidationException::withMessages(['expenditure'=>['Cumulative expenditure cannot exceed the sanctioned project amount.']]);
        $update=DB::transaction(function()use($project,$data,$request){$update=ProjectUpdate::create([...$data,'project_id'=>$project->id,'updated_by'=>$request->user()->id,'created_by'=>$request->user()->id]);$project->update(['progress_percentage'=>$data['progress_percentage'],'expenditure'=>$data['expenditure'],'status'=>$data['status']??($data['progress_percentage']==100?'completed':'in_progress'),'challenges'=>$data['challenges']??$project->challenges,'actual_completion_date'=>$data['progress_percentage']==100?($project->actual_completion_date??$data['update_date']):$project->actual_completion_date,'updated_by'=>$request->user()->id]);$this->audit($request,$project,'progress_updated',null,['project_update_id'=>$update->id,'progress_percentage'=>$data['progress_percentage'],'expenditure'=>$data['expenditure']]);return $update;});
        return response()->json($update,201);
    }

    public function storeMilestone(SaveProjectMilestoneRequest $request,string $project):JsonResponse
    { $owner=Project::findOrFail($project);$this->authorize('update',$owner);$data=$this->validateMilestoneAmounts($request->validated());$milestone=DB::transaction(function()use($owner,$data,$request){$row=ProjectMilestone::create([...$data,'project_id'=>$owner->id,'created_by'=>$request->user()->id]);$this->audit($request,$owner,'milestone_created',null,$row->getAttributes());return$row;});return response()->json($milestone,201); }

    public function updateMilestone(SaveProjectMilestoneRequest $request,string $project,string $milestone):JsonResponse
    { $owner=Project::findOrFail($project);$this->authorize('update',$owner);$row=ProjectMilestone::where('project_id',$owner->id)->findOrFail($milestone);$data=$this->validateMilestoneAmounts($request->validated());$old=$row->getAttributes();DB::transaction(function()use($row,$data,$request,$owner,$old){$row->update([...$data,'updated_by'=>$request->user()->id]);$this->audit($request,$owner,'milestone_updated',$old,$row->fresh()->getAttributes());});return response()->json($row->fresh()); }

    public function destroyMilestone(Request $request,string $project,string $milestone):JsonResponse
    { $owner=Project::findOrFail($project);$this->authorize('update',$owner);$row=ProjectMilestone::where('project_id',$owner->id)->findOrFail($milestone);abort_if($row->status==='completed',409,'Completed milestones cannot be deleted.');$old=$row->getAttributes();DB::transaction(function()use($row,$request,$owner,$old){$row->delete();$this->audit($request,$owner,'milestone_deleted',$old,null);});return response()->json(['message'=>'Milestone deleted.']); }

    public function storeBudget(SaveProjectBudgetRequest $request,string $project):JsonResponse
    { $owner=Project::findOrFail($project);$this->authorize('update',$owner);$data=$this->normalizeBudget($owner,$request->validated());$row=DB::transaction(function()use($owner,$data,$request){$budget=ProjectBudget::create([...$data,'project_id'=>$owner->id,'created_by'=>$request->user()->id]);$this->audit($request,$owner,'budget_created',null,$budget->getAttributes());return$budget;});return response()->json($row,201); }

    public function updateBudget(SaveProjectBudgetRequest $request,string $project,string $budget):JsonResponse
    { $owner=Project::findOrFail($project);$this->authorize('update',$owner);$row=ProjectBudget::where('project_id',$owner->id)->findOrFail($budget);$data=$this->normalizeBudget($owner,$request->validated(),$row);$old=$row->getAttributes();DB::transaction(function()use($row,$data,$request,$owner,$old){$row->update([...$data,'updated_by'=>$request->user()->id]);$this->audit($request,$owner,'budget_updated',$old,$row->fresh()->getAttributes());});return response()->json($row->fresh()); }

    public function destroyBudget(Request $request,string $project,string $budget):JsonResponse
    { $owner=Project::findOrFail($project);$this->authorize('update',$owner);$row=ProjectBudget::where('project_id',$owner->id)->findOrFail($budget);abort_if((float)$row->utilized_amount>0,409,'A budget head with utilization cannot be deleted.');$old=$row->getAttributes();DB::transaction(function()use($row,$request,$owner,$old){$row->delete();$this->audit($request,$owner,'budget_deleted',$old,null);});return response()->json(['message'=>'Budget head deleted.']); }

    public function storePhoto(UploadProjectPhotoRequest $request, string $project): JsonResponse
    {
        $owner = Project::findOrFail($project);
        $this->authorize('update', $owner);
        $data = $request->validated();
        $file = $request->file('photo');
        $path = $file->storeAs("projects/{$owner->id}/photos", Str::uuid().'.'.$file->extension(), 'local');
        abort_unless($path, 500, 'The photo could not be stored.');
        try {
            $photo = DB::transaction(function () use ($owner, $data, $file, $path, $request) {
                $photo = ProjectPhoto::create([...collect($data)->except('photo')->all(), 'project_id' => $owner->id, 'file_name' => $file->getClientOriginalName(), 'file_path' => $path, 'file_size' => $file->getSize(), 'status' => 'active', 'created_by' => $request->user()->id]);
                $this->audit($request, $owner, 'photo_uploaded', null, ['photo_id' => $photo->id, 'title' => $photo->title]);
                return $photo;
            });
        } catch (\Throwable $exception) {
            Storage::disk('local')->delete($path);
            throw $exception;
        }
        return response()->json($photo->makeHidden('file_path'), 201);
    }

    public function photo(Request $request, string $project, string $photo): StreamedResponse|JsonResponse
    {
        $owner = Project::findOrFail($project);
        $this->authorize('view', $owner);
        $record = ProjectPhoto::where('project_id', $owner->id)->findOrFail($photo);
        if (! Storage::disk('local')->exists($record->file_path)) return response()->json(['message' => 'Photo file not found.'], 404);
        return Storage::disk('local')->response($record->file_path, $record->file_name);
    }

    public function destroyPhoto(Request $request, string $project, string $photo): JsonResponse
    {
        $owner = Project::findOrFail($project);
        $this->authorize('update', $owner);
        $record = ProjectPhoto::where('project_id', $owner->id)->findOrFail($photo);
        $old = $record->getAttributes();
        DB::transaction(function () use ($record, $request, $owner, $old) { $record->delete(); $this->audit($request, $owner, 'photo_deleted', ['photo_id' => $old['id'], 'title' => $old['title']], null); });
        Storage::disk('local')->delete($old['file_path']);
        return response()->json(['message' => 'Project photo deleted.']);
    }

    private function audit(Request $request,Project $project,string $action,?array $old,?array $new):void
    {ActivityLog::create(['user_id'=>$request->user()->id,'loggable_type'=>Project::class,'loggable_id'=>$project->id,'action'=>$action,'module'=>'projects','description'=>"Project {$project->project_number} {$action}",'old_values'=>$old,'new_values'=>$new,'ip_address'=>$request->ip(),'user_agent'=>$request->userAgent()]);}

    private function normalizeLocation(array $data):array
    {
        $village=Village::with('mandal.assemblyConstituency')->findOrFail($data['village_id']);
        if(!empty($data['ward_id'])&&!Ward::whereKey($data['ward_id'])->where('village_id',$village->id)->exists())throw ValidationException::withMessages(['ward_id'=>['The selected ward does not belong to the selected village.']]);
        $data['mandal_id']=$village->mandal_id;$data['assembly_constituency_id']=$village->mandal?->assembly_constituency_id;$data['constituency_id']=$village->mandal?->assemblyConstituency?->constituency_id;return $data;
    }

    private function validateMilestoneAmounts(array $data):array
    { if(isset($data['budget'],$data['actual_cost'])&&(float)$data['actual_cost']>(float)$data['budget'])throw ValidationException::withMessages(['actual_cost'=>['Actual milestone cost cannot exceed its budget.']]);if(($data['status']??null)==='completed'&&empty($data['actual_date']))throw ValidationException::withMessages(['actual_date'=>['An actual date is required for a completed milestone.']]);return$data; }

    private function normalizeBudget(Project $project,array $data,?ProjectBudget $existing=null):array
    { $ceiling=(float)($data['revised_amount']??$data['allocated_amount']);if((float)$data['utilized_amount']>$ceiling)throw ValidationException::withMessages(['utilized_amount'=>['Utilized amount cannot exceed the current budget allocation.']]);$other=(float)$project->budgets()->when($existing,fn($query)=>$query->where('id','!=',$existing->id))->sum(DB::raw('COALESCE(revised_amount, allocated_amount)'));$projectCeiling=(float)($project->sanctioned_amount??$project->estimated_cost);if($other+$ceiling>$projectCeiling)throw ValidationException::withMessages(['allocated_amount'=>['Project budget heads cannot exceed the sanctioned project amount.']]);$data['balance_amount']=$ceiling-(float)$data['utilized_amount'];return$data; }
}
