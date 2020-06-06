import { api } from 'src/api/appApi';
import { Dog } from 'src/models/dog';

export default class DogRepository {
  private static baseIri = 'api/dogs';

  static get BaseIri(): string {
    return DogRepository.baseIri;
  }

  static getAll = (): Promise<Dog[]> => new Promise((resolve, reject) => {
    api.get(DogRepository.baseIri).then(({ data }) => {
      resolve(data);
    }).catch(() => {
      reject();
    });
  });
}
