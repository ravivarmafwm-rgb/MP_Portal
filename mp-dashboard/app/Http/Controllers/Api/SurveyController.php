<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Survey;
use App\Models\SurveyResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Services\GeographicScopeService;
use App\Http\Requests\Survey\SaveSurveyRequest;
use App\Http\Requests\Survey\SubmitSurveyResponseRequest;
use App\Http\Requests\Survey\AssignSurveyRequest;
use App\Models\ActivityLog;
use App\Models\SurveyAssignment;
use App\Models\SurveyQuestion;
use App\Models\SurveyResponseDetail;
use App\Models\Village;
use App\Models\Ward;
use App\Models\Volunteer;
use App\Services\SurveyResponseService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SurveyController extends Controller
{
    public function store(SaveSurveyRequest $request): JsonResponse
    {
        $this->authorize('create',Survey::class);$data=$this->normalizeScope($request->validated(),$request);$questions=$data['questions'];unset($data['questions']);$survey=DB::transaction(function()use($data,$questions,$request){$survey=Survey::create([...$data,'survey_code'=>'SUR-'.now()->format('Ymd').'-'.Str::upper(Str::random(6)),'status'=>'draft','is_active'=>true,'created_by'=>$request->user()->id]);$this->syncQuestions($survey,$questions,$request->user()->id);$this->audit($request,$survey,'created',['title'=>$survey->title]);return$survey;});return response()->json($survey->load('questions'),201);
    }

    public function update(SaveSurveyRequest $request,string $id):JsonResponse
    {
        $survey=Survey::findOrFail($id);$this->authorize('update',$survey);abort_unless($survey->status==='draft',409,'Only draft surveys can be edited.');$data=$this->normalizeScope($request->validated(),$request);$questions=$data['questions'];unset($data['questions']);$old=$survey->getAttributes();DB::transaction(function()use($survey,$data,$questions,$request,$old){$survey->update([...$data,'updated_by'=>$request->user()->id]);$this->syncQuestions($survey,$questions,$request->user()->id);$this->audit($request,$survey,'updated',['old'=>$old,'new'=>$survey->fresh()->getAttributes()]);});return response()->json($survey->fresh()->load('questions'));
    }

    public function destroy(Request $request,string $id):JsonResponse
    {
        $survey=Survey::findOrFail($id);$this->authorize('delete',$survey);abort_if($survey->responses()->exists(),409,'A survey with responses cannot be deleted.');$survey->delete();$this->audit($request,$survey,'deleted',['title'=>$survey->title]);return response()->json(['message'=>'Survey deleted.']);
    }

    public function publish(Request $request,string $id):JsonResponse
    {
        $survey=Survey::withCount('questions')->findOrFail($id);$this->authorize('update',$survey);abort_unless($survey->status==='draft',409,'Only draft surveys can be published.');abort_if($survey->questions_count<1,422,'Add at least one question before publishing.');abort_if($survey->end_date&&$survey->end_date->isBefore($survey->start_date),422,'Survey end date is invalid.');$survey->update(['status'=>'active','is_active'=>true,'updated_by'=>$request->user()->id]);$this->audit($request,$survey,'published',['questions'=>$survey->questions_count]);return response()->json($survey);
    }

    public function close(Request $request,string $id):JsonResponse
    {
        $survey=Survey::findOrFail($id);$this->authorize('update',$survey);abort_unless($survey->status==='active',409,'Only active surveys can be closed.');$survey->update(['status'=>'closed','is_active'=>false,'end_date'=>$survey->end_date??now()->toDateString(),'updated_by'=>$request->user()->id]);$this->audit($request,$survey,'closed',['total_responses'=>$survey->total_responses]);return response()->json($survey);
    }

    public function assignments(Request $request,string $id):JsonResponse{$survey=Survey::findOrFail($id);$this->authorize('view',$survey);return response()->json($survey->assignments()->with('volunteer:id,first_name,last_name,volunteer_id')->orderByDesc('assigned_date')->paginate(min(max($request->integer('per_page',20),1),100)));}
    public function assign(AssignSurveyRequest $request,string $id,GeographicScopeService $scope):JsonResponse{$survey=Survey::findOrFail($id);$this->authorize('update',$survey);$data=$request->validated();$volunteers=Volunteer::whereIn('id',$data['volunteer_ids'])->get();foreach($volunteers as $volunteer)abort_unless($scope->allows($request->user(),$volunteer),403);DB::transaction(function()use($survey,$volunteers,$data,$request){foreach($volunteers as $volunteer)SurveyAssignment::updateOrCreate(['survey_id'=>$survey->id,'volunteer_id'=>$volunteer->id],['target_responses'=>$data['target_responses']??null,'status'=>'assigned','assigned_date'=>now()->toDateString(),'due_date'=>$data['due_date']??null,'remarks'=>$data['remarks']??null,'assigned_by'=>$request->user()->id]);$this->audit($request,$survey,'assigned',['volunteer_count'=>$volunteers->count()]);});return response()->json(['message'=>'Survey assigned.','volunteer_count'=>$volunteers->count()]);}

    public function submit(SubmitSurveyResponseRequest $request,string $id,SurveyResponseService $service):JsonResponse{$survey=Survey::with('questions')->findOrFail($id);$this->authorize('view',$survey);$response=$service->submit($survey,$request->validated(),$request->file('attachments',[]),$request->user(),$request->ip(),$request->userAgent());return response()->json($response,201);}

    public function attachment(Request $request,string $response,string $detail):StreamedResponse|JsonResponse{$row=SurveyResponse::findOrFail($response);$survey=$row->survey;$this->authorize('view',$survey);$this->authorizeResponseAccess($request,$row);$answer=SurveyResponseDetail::where('survey_response_id',$row->id)->findOrFail($detail);abort_unless($answer->getRawOriginal('attachment'),404);$path=$answer->getRawOriginal('attachment');if(!Storage::disk('local')->exists($path))return response()->json(['message'=>'Attachment not found.'],404);return Storage::disk('local')->download($path);}
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Survey::class);
        $query = Survey::with(['constituency'])->withCount('responses');
        app(GeographicScopeService::class)->applyHierarchicalResources($query, $request->user());

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }
        if ($search = $request->get('search')) {
            $query->where('title', 'ilike', "%$search%");
        }

        $perPage = min((int) $request->get('per_page', 20), 100);
        $results = $query->orderByDesc('created_at')->paginate($perPage);

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
        $survey = Survey::with(['questions', 'constituency'])->findOrFail($id);
        $this->authorize('view', $survey);
        $survey->response_count = SurveyResponse::where('survey_id', $id)->count();

        return response()->json($survey);
    }

    public function responses(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Survey::class);
        $query = SurveyResponse::with(['survey', 'citizen', 'volunteer', 'village', 'ward']);
        $this->scopeResponses($query, $request);

        if ($surveyId = $request->get('survey_id')) {
            $query->where('survey_id', $surveyId);
        }

        if ($search = $request->get('search')) {
            $query->where(function ($responseQuery) use ($search) {
                $responseQuery
                    ->where('respondent_name', 'ilike', "%{$search}%")
                    ->orWhere('respondent_mobile', 'ilike', "%{$search}%")
                    ->orWhereHas('citizen', function ($citizenQuery) use ($search) {
                        $citizenQuery
                            ->where('first_name', 'ilike', "%{$search}%")
                            ->orWhere('last_name', 'ilike', "%{$search}%");
                    })
                    ->orWhereHas('village', function ($villageQuery) use ($search) {
                        $villageQuery->where('name', 'ilike', "%{$search}%");
                    });
            });
        }

        $perPage = min(max((int) $request->get('per_page', 20), 1), 100);
        $results = $query->orderByDesc('response_date')->orderByDesc('created_at')->paginate($perPage);

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

    public function response(Request $request, string $id): JsonResponse
    {
        $row = SurveyResponse::with([
            'survey:id,title,survey_code',
            'citizen:id,first_name,last_name,citizen_id',
            'volunteer:id,first_name,last_name,volunteer_id',
            'village:id,name',
            'ward:id,name',
            'responseDetails.surveyQuestion:id,question_text,question_type,sort_order',
        ])->findOrFail($id);
        $this->authorize('view', $row->survey);
        $this->authorizeResponseAccess($request, $row);

        $row->responseDetails->each(function (SurveyResponseDetail $detail) use ($row): void {
            $detail->setAttribute('has_attachment', filled($detail->getRawOriginal('attachment')));
            if ($detail->getAttribute('has_attachment')) {
                $detail->setAttribute('attachment_url', url("/api/survey-responses/{$row->id}/details/{$detail->id}/attachment"));
            }
        });

        return response()->json($row);
    }

    public function analytics(Request $request, string $id): JsonResponse
    {
        $survey = Survey::with(['questions' => fn ($query) => $query->orderBy('sort_order')])->findOrFail($id);
        $this->authorize('view', $survey);
        $responses = SurveyResponse::where('survey_id', $survey->id);
        $this->scopeResponses($responses, $request);
        $responseIds = (clone $responses)->pluck('id');

        $questions = $survey->questions->map(function (SurveyQuestion $question) use ($responseIds): array {
            $answers = SurveyResponseDetail::where('survey_question_id', $question->id)
                ->whereIn('survey_response_id', $responseIds)
                ->whereNotNull('answer')
                ->pluck('answer');
            $result = [
                'id' => $question->id,
                'question_text' => $question->question_text,
                'question_type' => $question->question_type,
                'answered' => $answers->count(),
                'distribution' => [],
                'average' => null,
            ];
            if (in_array($question->question_type, ['radio', 'dropdown', 'checkbox'], true)) {
                $counts = [];
                foreach ($answers as $answer) {
                    $values = $question->question_type === 'checkbox' ? json_decode($answer, true) : [$answer];
                    foreach (is_array($values) ? $values : [] as $value) $counts[(string) $value] = ($counts[(string) $value] ?? 0) + 1;
                }
                arsort($counts);
                $result['distribution'] = collect($counts)->map(fn ($count, $label) => ['label' => $label, 'count' => $count])->values();
            }
            if (in_array($question->question_type, ['number', 'rating'], true)) {
                $numeric = $answers->filter(fn ($answer) => is_numeric($answer))->map(fn ($answer) => (float) $answer);
                $result['average'] = $numeric->isNotEmpty() ? round($numeric->average(), 2) : null;
            }
            return $result;
        });

        return response()->json(['survey_id' => $survey->id, 'total_responses' => $responseIds->count(), 'questions' => $questions]);
    }

    public function exportResponses(Request $request): StreamedResponse
    {
        $this->authorize('viewAny', Survey::class);
        $query = SurveyResponse::with(['survey:id,title', 'village:id,name', 'ward:id,name', 'volunteer:id,first_name,last_name']);
        $this->scopeResponses($query, $request);
        if ($surveyId = $request->string('survey_id')->toString()) $query->where('survey_id', $surveyId);

        return response()->streamDownload(function () use ($query): void {
            $handle = fopen('php://output', 'wb');
            fputcsv($handle, ['Response ID', 'Survey', 'Respondent', 'Mobile', 'Village', 'Ward', 'Volunteer', 'Date', 'Status']);
            $query->orderBy('id')->chunkById(500, function ($rows) use ($handle): void {
                foreach ($rows as $row) fputcsv($handle, [
                    $row->id, $row->survey?->title, $row->respondent_name, $row->respondent_mobile,
                    $row->village?->name, $row->ward?->name,
                    trim(($row->volunteer?->first_name ?? '').' '.($row->volunteer?->last_name ?? '')),
                    $row->response_date?->toDateString(), $row->status,
                ]);
            });
            fclose($handle);
        }, 'survey-responses-'.now()->format('Y-m-d-His').'.csv', ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    public function stats(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Survey::class);
        $surveys = Survey::query(); $responses = SurveyResponse::query();
        app(GeographicScopeService::class)->applyHierarchicalResources($surveys, $request->user());
        app(GeographicScopeService::class)->apply($responses, $request->user());
        return response()->json([
            'total' => (clone $surveys)->count(), 'active' => (clone $surveys)->where('status', 'active')->count(),
            'draft' => (clone $surveys)->where('status', 'draft')->count(), 'total_responses' => (clone $responses)->count(),
            'this_month' => (clone $responses)->where('created_at', '>=', now()->startOfMonth())->count(),
        ]);
    }

    private function normalizeScope(array $data,Request $request):array
    {
        if(!empty($data['village_id'])){$village=Village::with('mandal.assemblyConstituency')->findOrFail($data['village_id']);abort_unless(app(GeographicScopeService::class)->allowsVillage($request->user(),$village->id),403);$data['mandal_id']=$village->mandal_id;$data['assembly_constituency_id']=$village->mandal?->assembly_constituency_id;$data['constituency_id']=$village->mandal?->assemblyConstituency?->constituency_id;}else{foreach(['constituency_id','assembly_constituency_id','mandal_id','village_id']as$field)if($request->user()->{$field})$data[$field]=$request->user()->{$field};}return$data;
    }
    private function syncQuestions(Survey $survey,array $questions,string $userId):void
    {
        $keep=[];foreach($questions as $index=>$data){$id=$data['id']??null;if($id&&!$survey->questions()->whereKey($id)->exists())throw ValidationException::withMessages(["questions.{$index}.id"=>['The question does not belong to this survey.']]);unset($data['id']);$question=$id?$survey->questions()->findOrFail($id):new SurveyQuestion(['survey_id'=>$survey->id,'created_by'=>$userId]);$question->fill([...$data,'sort_order'=>$index,'updated_by'=>$userId])->save();$keep[]=$question->id;}$survey->questions()->whereNotIn('id',$keep)->delete();
    }
    private function scopeResponses($query, Request $request): void
    {
        app(GeographicScopeService::class)->apply($query, $request->user());
        $volunteer = Volunteer::where('user_id', $request->user()->id)->first();
        if ($volunteer && !$request->user()->hasPermission('surveys.manage')) $query->where('volunteer_id', $volunteer->id);
    }
    private function authorizeResponseAccess(Request $request, SurveyResponse $response): void
    {
        $query = SurveyResponse::whereKey($response->id);
        $this->scopeResponses($query, $request);
        abort_unless($query->exists(), 403);
    }
    private function audit(Request $request,Survey $survey,string $action,array $values):void{ActivityLog::create(['user_id'=>$request->user()->id,'loggable_type'=>Survey::class,'loggable_id'=>$survey->id,'action'=>$action,'module'=>'surveys','description'=>"Survey {$survey->survey_code} {$action}",'new_values'=>$values,'ip_address'=>$request->ip(),'user_agent'=>$request->userAgent()]);}
}
