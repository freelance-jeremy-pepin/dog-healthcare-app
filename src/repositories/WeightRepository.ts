import { api } from 'src/api/appApi';
import { Dog } from 'src/models/dog';
import { Weight } from 'src/models/weight';

export default class WeightRepository {
  private static baseIri = 'api/weights';

  static get BaseIri(): string {
    return WeightRepository.baseIri;
  }

  static getByDog = (dog: Dog): Promise<Weight[]> => new Promise((resolve, reject) => {
    api.get(WeightRepository.baseIri, {
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
