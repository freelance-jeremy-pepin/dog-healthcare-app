import { BaseModel } from 'src/models/baseModel';

export interface Deworming extends BaseModel {
  dog: string;
  date: string;
  dewormingName: string;
  caredByOwner: boolean;
  caredByProfessional?: string;
  notes?: string;
}
