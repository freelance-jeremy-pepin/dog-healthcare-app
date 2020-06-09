import { BaseModel } from 'src/models/baseModel';

export interface ProfessionalType extends BaseModel {
  internalLabel: string;
  displayLabel: string;
  professionals: string[];
}
