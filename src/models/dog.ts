import { BaseModel } from 'src/models/baseModel';
import { User } from 'src/models/user';
import { Weight } from 'src/models/weight';

export interface Dog extends BaseModel {
    userId: number;
    name: string;
    breed: string;
    birthday: string;
    comments: string;
    user?: User;
    weights?: Weight[];
}

export function createDefaultDog(): Dog {
    return {
        id: undefined,
        userId: 0,
        name: '',
        breed: '',
        birthday: '',
        comments: '',
        user: undefined,
        weights: undefined,
        createdAt: undefined,
        updatedAt: undefined,
    };
}
