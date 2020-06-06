import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';
import UserRepository from 'src/repositories/UserRepository';
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

  @Action
  public fetch(email: string) {
    UserRepository.getByEmail(email).then((user: User) => {
      this.setUser(user);
    });
  }
}

export default getModule(UserModule);
