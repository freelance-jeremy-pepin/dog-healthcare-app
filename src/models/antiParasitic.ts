import { BaseModel } from 'src/models/baseModel';
import { Professional } from 'src/models/professional';

export interface AntiParasitic extends BaseModel {
  dog: string;
  date: string;
  antiParasiticName: string;
  caredByOwner: boolean;
  caredByProfessional?: string | null;
  notes?: string;
  caredByProfessionalDetails?: Professional;
}
