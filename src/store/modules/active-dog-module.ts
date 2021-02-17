import {
    Action,
    getModule,
    Module,
    Mutation,
    VuexModule,
} from 'vuex-module-decorators';
import { Dog } from 'src/models/dog';
import { Weight } from 'src/models/weight';
import WeightRepository from 'src/repositories/weightRepository';
import { Deworming } from 'src/models/deworming';
import DewormingRepository, { DewormingRelations } from 'src/repositories/dewormingRepository';
import {
    Reminder,
    ReminderTableName,
} from 'src/models/reminder';
import ReminderRepository, { ReminderRelations } from 'src/repositories/reminderRepository';
import { AntiParasitic } from 'src/models/antiParasitic';
import AntiParasiticRepository, { AntiParasiticRelations } from 'src/repositories/antiParasiticRepository';
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

    public get LastWeight(): Weight | undefined {
        if (this.Weights && this.Weights.length > 0) {
            return this.Weights[this.Weights.length - 1];
        }

        return undefined;
    }

    public get Dewormings(): Deworming[] | undefined {
        return this.dewormings;
    }

    public get LastDeworming(): Deworming | undefined {
        if (this.Dewormings && this.Dewormings.length > 0) {
            return this.Dewormings[this.Dewormings.length - 1];
        }

        return undefined;
    }

    public get AntiParasitics(): AntiParasitic[] | undefined {
        return this.antiParasitics;
    }

    public get LastAntiParasitic(): AntiParasitic | undefined {
        if (this.AntiParasitics && this.AntiParasitics.length > 0) {
            return this.AntiParasitics[this.AntiParasitics.length - 1];
        }

        return undefined;
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
            new WeightRepository().getAllByDog(this.Dog)
                .then((weights) => {
                    this.setWeights(weights);
                });
        }
    }

    @Action
    public updateWeight(weight: Weight) {
        new WeightRepository().update(weight)
            .then(() => {
                this.fetchWeights();
            });
    }

    @Action
    public fetchDewormings() {
        if (this.Dog) {
            new DewormingRepository().getAllByDog(this.Dog, [DewormingRelations.professional])
                .then((dewormings) => {
                    this.setDewormings(dewormings);
                });
        }
    }

    @Action
    public updateDeworming(deworming: Deworming) {
        new DewormingRepository().update(deworming)
            .then(() => {
                this.fetchDewormings();
            });
    }

    @Action
    public fetchAntiParasitics() {
        if (this.Dog) {
            new AntiParasiticRepository()
                .getAllByDog(this.Dog, [AntiParasiticRelations.professional])
                .then((antiParasitics) => {
                    this.setAntiParasitics(antiParasitics);
                });
        }
    }

    @Action
    public updateAntiParasitic(antiParasitic: AntiParasitic) {
        const antiParasiticRepository = new AntiParasiticRepository();
        antiParasiticRepository.update(antiParasitic)
            .then(() => {
                this.fetchAntiParasitics();
            });
    }

    @Action
    public fetchReminders() {
        if (this.Dog) {
            new ReminderRepository().getAllByDog(this.Dog, [ReminderRelations.timeInterval])
                .then((reminders) => {
                    this.setReminders(reminders);
                });
        }
    }

    @Action
    public updateReminder(reminder: Reminder) {
        const reminderRepository = new ReminderRepository();
        reminderRepository.update(reminder)
            .then(() => {
                this.fetchReminders();
            });
    }
}

export default getModule(ActiveDogModule);
