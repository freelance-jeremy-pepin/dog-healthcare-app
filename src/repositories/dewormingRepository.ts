import BaseRepository from 'src/repositories/baseRepository';
import { Deworming } from 'src/models/deworming';
import { Dog } from 'src/models/dog';
import { Reminder } from 'src/models/reminder';
import ReminderRepository from 'src/repositories/reminderRepository';

export enum DewormingRelations {
    professional = 'professional',
    dog = 'dog',
}

export default class DewormingRepository extends BaseRepository<Deworming, DewormingRelations> {
    constructor() {
        super('deworming');
    }

    public getAllByDog(dog: Dog, relations: DewormingRelations[]): Promise<Deworming[]> {
        return this.fetchMany(`dog/${dog.id}`, relations);
    }

    public getLast(dog: Dog, relations?: DewormingRelations[]): Promise<Deworming | null> {
        return this.fetchOne(`last/dog/${dog.id}`, relations);
    }

    public updateNextReminder(dog: Dog, reminder: Reminder): Promise<void> {
        return new Promise((resolve, reject) => {
            this.getLast(dog)
                .then((lastDeworming: Deworming | null) => {
                    if (lastDeworming) {
                        new ReminderRepository().updateNextReminder(reminder, lastDeworming.date)
                            .then(() => {
                                resolve();
                            })
                            .catch((error) => {
                                reject(error);
                            });
                    } else {
                        reject(`Impossible de mettre à jour le prochain rappel car il n'y a aucun vermifuge.`);
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}
