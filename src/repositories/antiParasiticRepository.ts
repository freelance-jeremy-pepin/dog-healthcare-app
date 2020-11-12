import BaseRepository from 'src/repositories/baseRepository';
import { Dog } from 'src/models/dog';
import { Reminder } from 'src/models/reminder';
import ReminderRepository from 'src/repositories/reminderRepository';
import { AntiParasitic } from 'src/models/antiParasitic';

export enum AntiParasiticRelations {
    professional = 'professional',
    dog = 'dog',
}

// eslint-disable-next-line max-len
export default class AntiParasiticRepository extends BaseRepository<AntiParasitic, AntiParasiticRelations> {
    constructor() {
        super('anti-parasitic');
    }

    public getAllByDog(dog: Dog, relations?: AntiParasiticRelations[]): Promise<AntiParasitic[]> {
        return this.fetchMany(`dog/${dog.id}`, relations);
    }

    public getLast(dog: Dog, relations?: AntiParasiticRelations[]): Promise<AntiParasitic | null> {
        return this.fetchOne(`last/dog/${dog.id}`, relations);
    }

    public updateNextReminder(dog: Dog, reminder: Reminder): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.getLast(dog)
                .then((lastAntiParasitic: AntiParasitic | null) => {
                    if (lastAntiParasitic) {
                        new ReminderRepository().updateNextReminder(reminder, lastAntiParasitic.date)
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
