import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';
import DogRepository from 'src/repositories/DogRepository';
import { Dog } from 'src/models/dog';
import store from '../index';

@Module({
  dynamic: true,
  store,
  name: 'dog-module',
  namespaced: true,
})
class DogModule extends VuexModule {
  public dogs?: Dog[] = undefined;

  public get Dogs(): Dog[] | undefined {
    return this.dogs;
  }

  @Mutation
  public setDogs(dogs: Dog[]) {
    this.dogs = dogs;
  }

  @Action
  public fetchAll() {
    const dogRepository = new DogRepository();
    dogRepository.getAll().then((dogs: Dog[]) => {
      this.setDogs(dogs);
    });
  }
}

export default getModule(DogModule);
