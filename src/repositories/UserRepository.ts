import { api } from 'src/api/appApi';
import { AxiosResponse } from 'axios';

export default class UserRepository {
  static getByEmail = (email: string): Promise<User> => new Promise((resolve, reject) => {
    api.get('api/users', {
      params: {
        email,
      },
    }).then((response: AxiosResponse) => {
      if (response.data['hydra:totalItems'] === 0) {
        reject();
      } else {
        const user: User = response.data['hydra:member'][0];
        resolve(user);
      }
    }).catch(() => {
      reject();
    });
  })
}


// api.get('api/users', {
//   params: {
//     email: email
//   }
// }).then((response: AxiosResponse) => {
//   resolve(response);
// }).catch(() => {
//   reject();
// })
