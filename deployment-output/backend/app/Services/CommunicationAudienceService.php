<?php
namespace App\Services;
use App\Models\Citizen;use App\Models\CommunicationCampaign;use App\Models\CommunicationConsent;use App\Models\Department;use App\Models\Volunteer;use Illuminate\Support\Collection;
class CommunicationAudienceService
{
 public function resolve(CommunicationCampaign $campaign):Collection
 {
  $filters=$campaign->audience_filters??[];$type=$filters['type']??null;$consents=CommunicationConsent::where('contact_type',rtrim((string)$type,'s'))->where('channel',$campaign->channel)->where('purpose',$campaign->purpose)->where('is_granted',true)->pluck('contact_id');
  if($type==='citizens'){$query=Citizen::whereIn('id',$consents)->where('is_deceased',false);$this->scopeCitizens($query,$filters);return$query->get()->map(fn($c)=>$this->recipient('citizen',$c->id,$campaign->channel==='email'?$c->email:$c->mobile_number,['name'=>trim($c->first_name.' '.$c->last_name)]))->filter(fn($r)=>$r['destination']);}
  if($type==='volunteers'){$query=Volunteer::whereIn('id',$consents)->where('status','active');$this->scopeVolunteers($query,$filters);return$query->get()->map(fn($v)=>$this->recipient('volunteer',$v->id,$campaign->channel==='email'?$v->email:$v->mobile_number,['name'=>trim($v->first_name.' '.$v->last_name)]))->filter(fn($r)=>$r['destination']);}
  if($type==='departments')return Department::whereIn('id',$consents)->get()->map(fn($d)=>$this->recipient('department',$d->id,$campaign->channel==='email'?$d->contact_email:$d->contact_phone,['name'=>$d->name]))->filter(fn($r)=>$r['destination']);return collect();
 }
 private function recipient(string $type,string $id,?string $destination,array $variables):array{return compact('type','id','destination','variables');}
 private function scopeCitizens($query,array $filters):void{if($id=$filters['constituency_id']??null)$query->whereHas('addresses.village.mandal.assemblyConstituency',fn($q)=>$q->where('constituency_id',$id));if($id=$filters['assembly_constituency_id']??null)$query->whereHas('addresses.village.mandal',fn($q)=>$q->where('assembly_constituency_id',$id));if($id=$filters['mandal_id']??null)$query->whereHas('addresses.village',fn($q)=>$q->where('mandal_id',$id));if($id=$filters['village_id']??null)$query->whereHas('addresses',fn($q)=>$q->where('village_id',$id));if($id=$filters['ward_id']??null)$query->whereHas('addresses',fn($q)=>$q->where('ward_id',$id));}
 private function scopeVolunteers($query,array $filters):void{if($id=$filters['constituency_id']??null)$query->whereHas('village.mandal.assemblyConstituency',fn($q)=>$q->where('constituency_id',$id));if($id=$filters['assembly_constituency_id']??null)$query->whereHas('village.mandal',fn($q)=>$q->where('assembly_constituency_id',$id));if($id=$filters['mandal_id']??null)$query->whereHas('village',fn($q)=>$q->where('mandal_id',$id));if($id=$filters['village_id']??null)$query->where('village_id',$id);if($id=$filters['ward_id']??null)$query->where('ward_id',$id);}
}
