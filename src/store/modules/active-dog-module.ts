import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';
import { Dog } from 'src/models/dog';
import { Weight } from 'src/models/weight';
import WeightRepository from 'src/repositories/WeightRepository';
import store from '../index';

@Module({
  dynamic: true,
  store,
  name: 'active-dog-module',
  namespaced: true,
})
class ActiveDogModule extends VuexModule {
  public dog?: Dog = undefined;

  public weights?: Weight[] = undefined;

  public get Dog(): Dog | undefined {
    return this.dog;
  }

  public get Weights(): Weight[] | undefined {
    return this.weights;
  }

  @Mutation
  public setDog(dog: Dog | undefined) {
    this.dog = dog;
  }

  @Mutation
  public setWeights(weights: Weight[] | undefined) {
    this.weights = weights;
  }

  @Action
  public refreshDog(dog: Dog) {
    this.setDog(dog);
    this.setWeights(undefined);

    WeightRepository.getByDog(dog).then((weights) => {
      this.setWeights(weights);
    });
  }
}

export default getModule(ActiveDogModule);
