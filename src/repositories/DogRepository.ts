import { api } from 'src/api/appApi';

export default class DogRepository {
  static getAll = (): Promise<Dog[]> => new Promise((resolve, reject) => {
    api.get('api/dogs').then(({ data }) => {
      resolve(data);
    }).catch(() => {
      reject();
    });
  })
}
