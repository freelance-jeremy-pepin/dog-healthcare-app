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
import { Deworming } from 'src/models/deworming';
import DewormingRepository from 'src/repositories/DewormingRepository';
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

  public dewormings?: Deworming[] = undefined;

  public isEditing = false;

  public get Dog(): Dog | undefined {
    return this.dog;
  }

  public get Weights(): Weight[] | undefined {
    return this.weights;
  }

  public get Dewormings(): Deworming[] | undefined {
    return this.dewormings;
  }

  public get IsEditing(): boolean {
    return this.isEditing;
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

  @Mutation
  public setDewormings(dewormings: Deworming[] | undefined) {
    this.dewormings = dewormings;
  }

  @Mutation
  public setDeworming(dewormings: Deworming) {
    if (this.dewormings) {
      // eslint-disable-next-line max-len
      this.dewormings = this.dewormings.map((d: Deworming) => (d.id === dewormings.id ? dewormings : d));
    } else {
      this.dewormings = [dewormings];
    }
  }

  @Mutation
  public setEditing(editing: boolean) {
    this.isEditing = editing;
  }

  @Action
  public refreshDog(dog: Dog | undefined) {
    this.setDog(dog);
    this.setWeights(undefined);
    this.setDewormings(undefined);

    this.fetchWeights();
    this.fetchDewormings();
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

  @Action
  public fetchDewormings() {
    if (this.Dog) {
      const dewormingRepository = new DewormingRepository();
      dewormingRepository.getByDog(this.Dog).then((dewormings) => {
        this.setDewormings(dewormings);
      });
    }
  }

  @Action
  public updateDeworming(deworming: Deworming) {
    const dewormingRepository = new DewormingRepository();
    dewormingRepository.update(deworming).then(() => {
      this.fetchDewormings();
    });
  }
}

export default getModule(ActiveDogModule);
