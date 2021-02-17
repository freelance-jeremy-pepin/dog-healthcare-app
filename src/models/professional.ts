import { BaseModel } from 'src/models/baseModel';
import { ProfessionalType } from 'src/models/professionalType';
import { User } from 'src/models/user';
import { AntiParasitic } from 'src/models/antiParasitic';
import { Deworming } from 'src/models/deworming';

export interface Professional extends BaseModel {
    professionalTypeId: number;
    userId: number;
    name: string;
    phoneNumber?: string;
    mobileNumber?: string;
    address?: string;
    city?: string;
    zipCode?: string;
    email?: string;
    notes?: string;
    professionalType?: ProfessionalType;
    user?: User;
    antiParasitics?: AntiParasitic[];
    dewormings?: Deworming[];
}

export function createDefaultProfessional(): Professional {
    return {
        id: undefined,
        professionalTypeId: 0,
        userId: 0,
        name: '',
        phoneNumber: '',
        mobileNumber: '',
        address: '',
        city: '',
        zipCode: '',
        email: '',
        notes: '',
        professionalType: undefined,
        user: undefined,
        antiParasitics: undefined,
        dewormings: undefined,
        createdAt: undefined,
        updatedAt: undefined,
    };
}
