import BaseRepository from 'src/repositories/BaseRepository';
import { Dog } from 'src/models/dog';
import { Reminder } from 'src/models/reminder';
import ReminderRepository from 'src/repositories/ReminderRepository';
import { getIdFromIRI } from 'src/utils/stringFormat';
import ProfessionalRepository from 'src/repositories/ProfessionalRepository';
import { Professional } from 'src/models/professional';
import { AntiParasitic } from 'src/models/antiParasitic';

export default class AntiParasiticRepository extends BaseRepository<AntiParasitic> {
    constructor() {
        super('anti_parasitics');
        this.date = ['date'];
    }

    // eslint-disable-next-line max-len
    public getByDog = (dog: Dog, withCaredByProfessionalDetails = false): Promise<AntiParasitic[]> => {
        if (withCaredByProfessionalDetails) {
            return new Promise((resolve, reject) => {
                const professionalRepository = new ProfessionalRepository();

                professionalRepository.getAll().then((professionals: Professional[]) => {
                    this.fetchMany(this.baseIri, {
                        params: {
                            dog: dog.id,
                        },
                    }).then((antiParasitics: AntiParasitic[]) => {
                        antiParasitics = antiParasitics.map((d: AntiParasitic) => {
                            if (d.caredByProfessional) {
                                const professionalId: number = getIdFromIRI(d.caredByProfessional);
                                // eslint-disable-next-line max-len
                                d.caredByProfessionalDetails = professionals.find((p: Professional) => p.id === professionalId);
                            }

                            return d;
                        });
                        resolve(antiParasitics);
                    });
                }).catch((error) => {
                    reject(error);
                });
            });
        }

        return this.fetchMany(this.baseIri, {
            params: {
                dog: dog.id,
            },
        });
    };

    public getLast = (): Promise<AntiParasitic | null> => new Promise((resolve, reject) => {
        this.fetchMany(this.baseIri, {
            params: {
                'order[date]': 'desc',
                page: 1,
            },
        }).then((antiParasitics: AntiParasitic[]) => {
            if (antiParasitics.length > 0) {
                resolve(antiParasitics[0]);
            } else {
                resolve(null);
            }
        }).catch((error) => {
            reject(error);
        });
    });

    public updateNextReminder(reminder: Reminder): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.getLast().then((lastAntiParasitic: AntiParasitic | null) => {
                const reminderRepository = new ReminderRepository();
                reminderRepository.updateNextReminder(reminder, lastAntiParasitic?.date).then(() => {
                    resolve(true);
                }).catch((error) => {
                    reject(error);
                });
            }).catch((error) => {
                reject(error);
            });
        });
    }
}
