import { Dog } from 'src/models/dog';
import { Weight } from 'src/models/weight';
import BaseRepository from 'src/repositories/baseRepository';

export enum WeightRelations {
    dog = 'dog',
}

export default class WeightRepository extends BaseRepository<Weight, WeightRelations> {
    constructor() {
        super('weight');
    }

    public getAllByDog(dog: Dog, relations?: WeightRelations[]): Promise<Weight[]> {
        return this.fetchMany(`dog/${dog.id}`, relations);
    }
}
