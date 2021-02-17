import { Dog } from 'src/models/dog';
import BaseRepository from 'src/repositories/baseRepository';

export enum DogRelations {
    user = 'user',
    weights = 'weights',
}

export default class DogRepository extends BaseRepository<Dog, DogRelations> {
    constructor() {
        super('dog');
    }
}
