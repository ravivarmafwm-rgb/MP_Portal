<?php
namespace App\Http\Resources; use Illuminate\Http\Request; use Illuminate\Http\Resources\Json\JsonResource;
class ProjectLookupResource extends JsonResource { public function toArray(Request $request):array{return ['id'=>$this->id,'name'=>$this->name,'code'=>$this->code,'description'=>$this->description,'is_active'=>$this->is_active,'contact_person'=>$this->contact_person,'contact_email'=>$this->contact_email,'contact_phone'=>$this->contact_phone,'created_at'=>$this->created_at];} }
