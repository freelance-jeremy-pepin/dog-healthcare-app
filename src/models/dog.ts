import { BaseModel } from 'src/models/baseModel';

export interface Dog extends BaseModel {
    name: string;
    breed: string;
    birthday: string;
    comments: string;
    user: string;
}
