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
import {
  Reminder,
  ReminderTableName,
} from 'src/models/reminder';
import ReminderRepository from 'src/repositories/ReminderRepository';
import { AntiParasitic } from 'src/models/antiParasitic';
import AntiParasiticRepository from 'src/repositories/AntiParasiticRepository';
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

  public antiParasitics?: AntiParasitic[] = undefined;

  public reminders?: Reminder[] = undefined;

  public get Dog(): Dog | undefined {
    return this.dog;
  }

  public get Weights(): Weight[] | undefined {
    return this.weights;
  }

  public get LastWeight(): Weight | null {
    if (this.Weights && this.Weights.length > 0) {
      return this.Weights[0];
    }

    return null;
  }

  public get Dewormings(): Deworming[] | undefined {
    return this.dewormings;
  }

  public get LastDeworming(): Deworming | null {
    if (this.Dewormings && this.Dewormings.length > 0) {
      return this.Dewormings[0];
    }

    return null;
  }

  public get AntiParasitics(): AntiParasitic[] | undefined {
    return this.antiParasitics;
  }

  public get LastAntiParasitic(): AntiParasitic | null {
    if (this.AntiParasitics && this.AntiParasitics.length > 0) {
      return this.AntiParasitics[0];
    }

    return null;
  }

  public get Reminders(): Reminder[] | undefined {
    return this.reminders;
  }

  public get Reminder(): (tableName: ReminderTableName) => Reminder | undefined {
    return (tableName: ReminderTableName) => {
      if (this.reminders) {
        return this.reminders.find((r: Reminder) => r.tableName === tableName);
      }
      return undefined;
    };
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
  public setDeworming(deworming: Deworming) {
    if (this.dewormings) {
      // eslint-disable-next-line max-len
      this.dewormings = this.dewormings.map((d: Deworming) => (d.id === deworming.id ? deworming : d));
    } else {
      this.dewormings = [deworming];
    }
  }

  @Mutation
  public setAntiParasitics(antiParasitics: AntiParasitic[] | undefined) {
    this.antiParasitics = antiParasitics;
  }

  @Mutation
  public setAntiParasitic(antiParasitic: AntiParasitic) {
    if (this.antiParasitics) {
      // eslint-disable-next-line max-len
      this.antiParasitics = this.antiParasitics.map((ap: AntiParasitic) => (ap.id === antiParasitic.id ? antiParasitic : ap));
    } else {
      this.antiParasitics = [antiParasitic];
    }
  }

  @Mutation
  public setReminders(reminders: Reminder[] | undefined) {
    this.reminders = reminders;
  }

  @Action
  public refreshDog(dog: Dog | undefined) {
    this.setDog(dog);
    this.setWeights(undefined);
    this.setDewormings(undefined);
    this.setAntiParasitics(undefined);
    this.setReminders(undefined);

    this.fetchWeights();
    this.fetchDewormings();
    this.fetchAntiParasitics();
    this.fetchReminders();
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
      dewormingRepository.getByDog(this.Dog, true).then((dewormings) => {
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

  @Action
  public fetchAntiParasitics() {
    if (this.Dog) {
      const antiParasiticRepository = new AntiParasiticRepository();
      antiParasiticRepository.getByDog(this.Dog, true).then((antiParasitics) => {
        this.setAntiParasitics(antiParasitics);
      });
    }
  }

  @Action
  public updateAntiParasitic(antiParasitic: AntiParasitic) {
    const antiParasiticRepository = new AntiParasiticRepository();
    antiParasiticRepository.update(antiParasitic).then(() => {
      this.fetchAntiParasitics();
    });
  }

  @Action
  public fetchReminders() {
    if (this.Dog) {
      const reminderRepository = new ReminderRepository();
      reminderRepository.getByDog(this.Dog, true).then((reminders) => {
        this.setReminders(reminders);
      });
    }
  }

  @Action
  public updateReminder(reminder: Reminder) {
    const reminderRepository = new ReminderRepository();
    reminderRepository.update(reminder).then(() => {
      this.fetchReminders();
    });
  }
}

export default getModule(ActiveDogModule);
