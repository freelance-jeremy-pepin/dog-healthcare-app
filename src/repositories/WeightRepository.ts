import { Dog } from 'src/models/dog';
import { Weight } from 'src/models/weight';
import BaseRepository from 'src/repositories/BaseRepository';

export default class WeightRepository extends BaseRepository<Weight> {
    constructor() {
        super('weights');
        this.date = ['date'];
    }

    public getByDog = (dog: Dog): Promise<Weight[]> => this.fetchMany(this.baseIri, {
        params: {
            dog: dog.id,
        },
    });
}
