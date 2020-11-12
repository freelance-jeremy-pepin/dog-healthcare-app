import { BaseModel } from 'src/models/baseModel';
import { Professional } from 'src/models/professional';
import { Dog } from 'src/models/dog';

export interface AntiParasitic extends BaseModel {
    dogId: number;
    caredByProfessionalId?: number;
    date: string;
    antiParasiticName: string;
    caredByOwner: boolean;
    notes?: string;
    dog?: Dog;
    caredByProfessional?: Professional;
}

export function createDefaultAntiParasitic(): AntiParasitic {
    return {
        id: undefined,
        dogId: 0,
        caredByProfessionalId: undefined,
        date: '',
        antiParasiticName: '',
        caredByOwner: true,
        notes: undefined,
        dog: undefined,
        caredByProfessional: undefined,
        createdAt: undefined,
        updatedAt: undefined,
    };
}
