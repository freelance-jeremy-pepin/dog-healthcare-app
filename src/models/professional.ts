import { BaseModel } from 'src/models/baseModel';
import { ProfessionalType } from 'src/models/professionalType';

export interface Professional extends BaseModel {
    professionalType: string;
    name: string;
    phoneNumber?: string;
    mobileNumber?: string;
    address?: string;
    city?: string;
    zipCode?: string;
    email?: string;
    notes?: string;
    professionalTypeDetails?: ProfessionalType;
}
