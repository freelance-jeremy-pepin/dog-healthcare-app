import BaseRepository from 'src/repositories/BaseRepository';
import { Deworming } from 'src/models/deworming';
import { Dog } from 'src/models/dog';

export default class DewormingRepository extends BaseRepository<Deworming> {
  constructor() {
    super('dewormings');
    this.dateTime = ['date'];
  }

  public getByDog = (dog: Dog): Promise<Deworming[]> => this.fetchMany(this.baseIri, {
    params: {
      dog: dog.id,
    },
  });
}
