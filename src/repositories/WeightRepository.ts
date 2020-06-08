import { Dog } from 'src/models/dog';
import { Weight } from 'src/models/weight';
import axios from 'axios';
import BaseRepository from 'src/repositories/BaseRepository';

export default class WeightRepository extends BaseRepository<Weight> {
  constructor() {
    super('weights');
  }

  getByDog = (dog: Dog): Promise<Weight[]> => new Promise((resolve, reject) => {
    axios.get(this.baseIri, {
      params: {
        dog: dog.id,
      },
    }).then(({ data }) => {
      resolve(data);
    }).catch(() => {
      reject();
    });
  });
}
