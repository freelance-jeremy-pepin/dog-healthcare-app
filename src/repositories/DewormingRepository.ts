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

  public getLast = (): Promise<Deworming | null> => new Promise((resolve, reject) => {
    this.fetchMany(this.baseIri, {
      params: {
        'order[date]': 'desc',
        page: 1,
      },
    }).then((dewormings: Deworming[]) => {
      if (dewormings.length > 0) {
        resolve(dewormings[0]);
      } else {
        resolve(null);
      }
    }).catch((error) => {
      reject(error);
    });
  });
}