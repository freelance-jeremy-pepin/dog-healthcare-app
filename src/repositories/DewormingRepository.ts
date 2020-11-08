import BaseRepository from 'src/repositories/BaseRepository';
import { Deworming } from 'src/models/deworming';
import { Dog } from 'src/models/dog';
import { Reminder } from 'src/models/reminder';
import ReminderRepository from 'src/repositories/ReminderRepository';
import { getIdFromIRI } from 'src/utils/stringFormat';
import ProfessionalRepository from 'src/repositories/ProfessionalRepository';
import { Professional } from 'src/models/professional';

export default class DewormingRepository extends BaseRepository<Deworming> {
    constructor() {
        super('dewormings');
        this.date = ['date'];
    }

    public getByDog = (dog: Dog, withCaredByProfessionalDetails = false): Promise<Deworming[]> => {
        if (withCaredByProfessionalDetails) {
            return new Promise((resolve, reject) => {
                const professionalRepository = new ProfessionalRepository();

                professionalRepository.getAll().then((professionals: Professional[]) => {
                    this.fetchMany(this.baseIri, {
                        params: {
                            dog: dog.id,
                        },
                    }).then((dewormings: Deworming[]) => {
                        dewormings = dewormings.map((d: Deworming) => {
                            if (d.caredByProfessional) {
                                const professionalId: number = getIdFromIRI(d.caredByProfessional);
                                // eslint-disable-next-line max-len
                                d.caredByProfessionalDetails = professionals.find((p: Professional) => p.id === professionalId);
                            }

                            return d;
                        });
                        resolve(dewormings);
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

    public getLast = (): Promise<Deworming | null> => new Promise((resolve, reject) => {
        this.fetchMany(this.baseIri, {
            params: {
                'order[date]': 'desc',
                page: 1,
            },
        }).then((dewormings: Deworming[]) => {
            if (dewormings.length > 0) {
                resolve(dewormings[0]);
            } else {
                resolve(null);
            }
        }).catch((error) => {
            reject(error);
        });
    });

    public updateNextReminder(reminder: Reminder): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.getLast().then((lastDeworming: Deworming | null) => {
                const reminderRepository = new ReminderRepository();
                reminderRepository.updateNextReminder(reminder, lastDeworming?.date).then(() => {
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
