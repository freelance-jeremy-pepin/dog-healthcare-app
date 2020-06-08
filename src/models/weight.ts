import { BaseModel } from 'src/models/baseModel';

export interface Weight extends BaseModel {
  dog: string;
  date: string;
  weight: string;
}
