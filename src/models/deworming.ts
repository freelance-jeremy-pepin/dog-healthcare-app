import { BaseModel } from 'src/models/baseModel';
import { Professional } from 'src/models/professional';
import { Dog } from 'src/models/dog';

export interface Deworming extends BaseModel {
    dogId: number;
    caredByProfessionalId?: number;
    date: string;
    dewormingName: string;
    caredByOwner: boolean;
    notes?: string;
    dog?: Dog;
    caredByProfessional?: Professional;
}

export function createDefaultDeworming(): Deworming {
    return {
        id: undefined,
        dogId: 0,
        caredByProfessionalId: undefined,
        date: '',
        dewormingName: '',
        caredByOwner: true,
        notes: undefined,
        dog: undefined,
        caredByProfessional: undefined,
        createdAt: undefined,
        updatedAt: undefined,
    };
}
