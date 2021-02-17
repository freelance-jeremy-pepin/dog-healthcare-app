import BaseRepository from 'src/repositories/baseRepository';
import { Dog } from 'src/models/dog';
import { Reminder } from 'src/models/reminder';
import DateInterval from 'src/utils/dateInterval';

export enum ReminderRelations {
    user = 'user',
    timeInterval = 'timeInterval',
}

export default class ReminderRepository extends BaseRepository<Reminder, ReminderRelations> {
    constructor() {
        super('reminder');
    }

    public getAllByDog(dog: Dog, relations: ReminderRelations[]): Promise<Reminder[]> {
        return this.fetchMany(`dog/${dog.id}`, relations);
    }

    public updateNextReminder(reminder: Reminder, lastDate: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (reminder.timeInterval) {
                reminder.nextReminder = DateInterval.add(
                    lastDate,
                    reminder.numberTimeInterval,
                    reminder.timeInterval,
                );

                new ReminderRepository().update(reminder)
                    .then(() => {
                        resolve();
                    })
                    .catch((error) => {
                        reject(error);
                    });
            } else {
                reject('Le rappel doit contenir un intervalle de temps.');
            }
        });
    }
}
