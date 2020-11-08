import { User } from 'src/models/user';
import { Dog } from 'src/models/dog';
import DogRepository from 'src/repositories/DogRepository';
import axios, {
    AxiosError,
} from 'axios';
import BaseRepository from 'src/repositories/BaseRepository';
import UserModule from '../store/modules/user-module';

export enum UserRelations {
    activeDog = 'activeDog',
    dogs = 'dogs'
}

export default class UserRepository extends BaseRepository<User> {
    constructor() {
        super('user');
    }

    getMe(relations: UserRelations[] = []): Promise<User> {
        return new Promise((resolve, reject) => {
            this.fetchOne('me', relations)
                .then((me) => {
                    resolve(me);
                })
                .catch((e: AxiosError) => {
                    reject(e);
                });
        });
    }

    updateActiveDog = (dog: Dog | undefined) => {
        if (UserModule.User) {
            const dogRepository = new DogRepository();
            axios.put(`${this.baseIri}/${UserModule.User.id}`, {
                activeDog: dog ? `${dogRepository.BaseIri}/${dog.id}` : null,
            });
        }
    }
}
