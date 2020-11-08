import { Dog } from 'src/models/dog';
import { BaseModel } from 'src/models/baseModel';

export interface User extends BaseModel {
    email: string;
    firstname: string;
    lastname: string;
    activeDog?: Dog;
}
