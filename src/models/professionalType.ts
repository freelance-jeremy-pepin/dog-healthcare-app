import { BaseModel } from 'src/models/baseModel';
import { Professional } from 'src/models/professional';

export interface ProfessionalType extends BaseModel {
  internalLabel: string;
  displayLabel: string;
  professionals?: Professional[];
}
