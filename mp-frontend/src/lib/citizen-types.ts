export interface Citizen {
  id: string;
  name: string;
  occupation: string;
  gender: string;
  age: number;
  mobile: string;
  email?: string;
  village: string;
  mandal: string;
  pincode: string;
  status: string;
  familyId: string;
  booth: string;
  isSchemeBeneficiary?: boolean;
  isVolunteerVerified?: boolean;
  isSeniorCitizen?: boolean;
}
export interface ActivityEvent {
  id: string;
  icon:
    | "register"
    | "visit"
    | "scheme"
    | "grievance"
    | "survey"
    | "meeting"
    | "document";
  title: string;
  date: string;
  description: string;
}
export interface DocumentRecord {
  id: string;
  type: string;
  number: string;
  issuedOn: string;
  verified: boolean;
}
export interface FamilyMember {
  citizenId: string;
  name: string;
  age: number;
  gender: string;
  relation: string;
  isHead: boolean;
}
export interface Family {
  id: string;
  members: FamilyMember[];
}
export interface InteractionRecord {
  id: string;
  type: string;
  summary: string;
  date: string;
}
