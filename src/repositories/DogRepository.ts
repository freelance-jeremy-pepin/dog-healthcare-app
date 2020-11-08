import { Dog } from 'src/models/dog';
import BaseRepository from 'src/repositories/BaseRepository';

export default class DogRepository extends BaseRepository<Dog> {
    constructor() {
        super('dogs');
        this.date = ['birthday'];
    }
}
