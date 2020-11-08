import {
    Action,
    getModule,
    Module,
    Mutation,
    VuexModule,
} from 'vuex-module-decorators';
import UserRepository from 'src/repositories/UserRepository';
import { User } from 'src/models/user';
import { Dog } from 'src/models/dog';
import store from '../index';

@Module({
    dynamic: true,
    store,
    name: 'user-module',
    namespaced: true,
})
class UserModule extends VuexModule {
    public user?: User = undefined;

    public get User(): User | undefined {
        return this.user;
    }

    @Mutation
    public setUser(user: User) {
        this.user = user;
    }

    @Mutation
    public setActiveDog(dog: Dog | undefined) {
        if (this.user) {
            this.user = { ...this.user, activeDog: dog };

            const userRepository = new UserRepository();
            userRepository.updateActiveDog(dog);
        }
    }

    @Action
    public fetch(email: string) {
        const userRepository = new UserRepository();
        userRepository.getByEmail(email).then((user: User) => {
            this.setUser(user);
        });
    }
}

export default getModule(UserModule);
