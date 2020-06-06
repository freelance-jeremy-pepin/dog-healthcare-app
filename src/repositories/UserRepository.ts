import { api } from 'src/api/appApi';

export default class UserRepository {
  static getByEmail = (email: string): Promise<User> => new Promise((resolve, reject) => {
    api.get('api/users', {
      params: {
        email,
      },
    }).then(({ data }) => {
      if (data.length < 1) {
        reject();
      } else {
        resolve(data[0]);
      }
    }).catch(() => {
      reject();
    });
  })
}
