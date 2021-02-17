import { Dog } from 'src/models/dog';
import { BaseModel } from 'src/models/baseModel';

export interface User extends BaseModel {
    activeDogId?: number;
    email: string;
    firstname: string;
    lastname: string;
    activeDog?: Dog;
    dogs?: Dog[];
}

export function createDefaultUser(): User {
    return {
        id: undefined,
        activeDogId: undefined,
        email: '',
        firstname: '',
        lastname: '',
        activeDog: undefined,
        dogs: undefined,
        createdAt: undefined,
        updatedAt: undefined,
    };
}
