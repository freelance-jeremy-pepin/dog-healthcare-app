import { BaseModel } from 'src/models/baseModel';
import { Dog } from 'src/models/dog';

export interface Weight extends BaseModel {
    dogId: number;
    date: string;
    weight: string;
    dog?: Dog;
}

export function createDefaultWeight(): Weight {
    return {
        id: undefined,
        dogId: 0,
        date: '',
        weight: '',
        dog: undefined,
        createdAt: undefined,
        updatedAt: undefined,
    };
}
