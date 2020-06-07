import { Dog } from 'src/models/dog';
import { Weight } from 'src/models/weight';
import axios from 'axios';

export default class WeightRepository {
  private static baseIri = 'api/weights';

  static getByDog = (dog: Dog): Promise<Weight[]> => new Promise((resolve, reject) => {
    axios.get(WeightRepository.baseIri, {
      params: {
        dog: dog.id,
      },
    }).then(({ data }) => {
      resolve(data);
    }).catch(() => {
      reject();
    });
  });

  static update = (weight: Weight): Promise<Weight> => new Promise((resolve, reject) => {
    axios.put(`${WeightRepository.baseIri}/${weight.id}`, weight).then(({ data }) => {
      resolve(data);
    }).catch(() => {
      reject();
    });
  })
}
