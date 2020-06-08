import { User } from 'src/models/user';
import { Dog } from 'src/models/dog';
import DogRepository from 'src/repositories/DogRepository';
import axios from 'axios';
import BaseRepository from 'src/repositories/BaseRepository';
import { getIdFromIRI } from 'src/utils/stringFormat';
import UserModule from '../store/modules/user-module';

export default class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users');
  }

  getByEmail = (email: string): Promise<User> => new Promise((resolve, reject) => {
    axios.get(this.baseIri, {
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
          const dogRepository = new DogRepository();
          dogRepository.getById(getIdFromIRI(data[0].activeDog)).then((responseDog: Dog) => {
            user.activeDog = responseDog;
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

  updateActiveDog = (dog: Dog | undefined) => {
    if (UserModule.User) {
      const dogRepository = new DogRepository();
      axios.put(`${this.baseIri}/${UserModule.User.id}`, {
        activeDog: dog ? `${dogRepository.BaseIri}/${dog.id}` : null,
      });
    }
  }
}
