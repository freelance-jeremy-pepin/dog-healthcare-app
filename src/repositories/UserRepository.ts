import { User } from 'src/models/user';
import { Dog } from 'src/models/dog';
import DogRepository from 'src/repositories/DogRepository';
import axios from 'axios';
import UserModule from '../store/modules/user-module';

export default class UserRepository {
  private static baseIri = 'api/users';

  static getByEmail = (email: string): Promise<User> => new Promise((resolve, reject) => {
    axios.get(UserRepository.baseIri, {
      params: {
        email,
      },
    }).then(({ data }) => {
      if (data.length < 1) {
        reject();
      } else {
        const user: User = data[0];

        // Récupération du chien actif
        if (data[0].activeDog) {
          axios.get(data[0].activeDog).then((responseDog) => {
            user.activeDog = responseDog.data;
            resolve(user);
          });
        } else {
          resolve(user);
        }
      }
    }).catch(() => {
      reject();
    });
  });

  static updateActiveDog = (dog: Dog | undefined) => {
    if (UserModule.User) {
      axios.put(`${UserRepository.baseIri}/${UserModule.User.id}`, {
        activeDog: dog ? `${DogRepository.BaseIri}/${dog.id}` : null,
      });
    }
  }
}
