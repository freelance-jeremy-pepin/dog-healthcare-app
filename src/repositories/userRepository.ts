import { User } from 'src/models/user';
import { Dog } from 'src/models/dog';
import {
    AxiosError,
} from 'axios';
import BaseRepository from 'src/repositories/baseRepository';
import UserModule from '../store/modules/user-module';

export enum UserRelations {
    activeDog = 'activeDog',
    dogs = 'dogs'
}

export default class UserRepository extends BaseRepository<User, UserRelations> {
    constructor() {
        super('user');
    }

    public getMe(relations: UserRelations[] = []): Promise<User> {
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

    public updateActiveDog(dog: Dog): Promise<User> {
        if (UserModule.User) {
            return this.update({ ...UserModule.User, activeDogId: dog.id }, this.baseIri);
        }

        throw new Error('Aucun utilisateur actif.');
    }
}
