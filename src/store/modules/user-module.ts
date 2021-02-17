import {
    Action,
    getModule,
    Module,
    Mutation,
    VuexModule,
} from 'vuex-module-decorators';
import UserRepository, { UserRelations } from 'src/repositories/userRepository';
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
    public user: User | undefined = undefined;

    public get User(): User | undefined {
        return this.user;
    }

    @Mutation
    public setUser(user: User) {
        this.user = user;
    }

    @Mutation
    public setActiveDog(dog: Dog | undefined) {
        if (this.user && dog) {
            this.user = { ...this.user, activeDog: dog };

            new UserRepository().updateActiveDog(dog).then();
        }
    }

    @Action
    public fetchMe() {
        new UserRepository().getMe([UserRelations.activeDog])
            .then((user: User) => {
                this.setUser(user);
            });
    }
}

export default getModule(UserModule);
