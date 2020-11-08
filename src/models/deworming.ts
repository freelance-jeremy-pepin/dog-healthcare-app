import { BaseModel } from 'src/models/baseModel';
import { Professional } from 'src/models/professional';

export interface Deworming extends BaseModel {
    dog: string;
    date: string;
    dewormingName: string;
    caredByOwner: boolean;
    caredByProfessional?: string | null;
    notes?: string;
    caredByProfessionalDetails?: Professional;
}
