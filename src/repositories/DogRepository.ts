import { Dog } from 'src/models/dog';
import axios from 'axios';

export default class DogRepository {
  private static baseIri = 'api/dogs';

  static get BaseIri(): string {
    return DogRepository.baseIri;
  }

  static getAll = (): Promise<Dog[]> => new Promise((resolve, reject) => {
    axios.get(DogRepository.baseIri).then(({ data }) => {
      resolve(data);
    }).catch(() => {
      reject();
    });
  });
}
