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

  @Mutation
  public setWeight(weight: Weight) {
    if (this.weights) {
      this.weights = this.weights.map((w: Weight) => (w.id === weight.id ? weight : w));
    } else {
      this.weights = [weight];
    }
  }

  @Action
  public refreshDog(dog: Dog | undefined) {
    this.setDog(dog);
    this.setWeights(undefined);

    this.fetchWeights();
  }

  @Action
  public fetchWeights() {
    if (this.Dog) {
      const weightRepository = new WeightRepository();
      weightRepository.getByDog(this.Dog).then((weights) => {
        this.setWeights(weights);
      });
    }
  }

  @Action
  public updateWeight(weight: Weight) {
    const weightRepository = new WeightRepository();
    weightRepository.update(weight).then(() => {
      this.fetchWeights();
    });
  }
}

export default getModule(ActiveDogModule);
