import BaseRepository from 'src/repositories/BaseRepository';
import { Dog } from 'src/models/dog';
import { Reminder } from 'src/models/reminder';
import { getIdFromIRI } from 'src/utils/stringFormat';
import TimeIntervalRepository from 'src/repositories/TimeIntervalRepository';
import { TimeInterval } from 'src/models/timeInterval';

export default class ReminderRepository extends BaseRepository<Reminder> {
  constructor() {
    super('reminders');
    this.date = ['nextReminder'];
  }

  public getByDog = (dog: Dog, withTimeIntervalsDetails = false): Promise<Reminder[]> => {
    if (withTimeIntervalsDetails) {
      return new Promise((resolve, reject) => {
        const timeIntervalRepository = new TimeIntervalRepository();

        timeIntervalRepository.getAll().then((timeIntervals: TimeInterval[]) => {
          this.fetchMany(this.baseIri, {
            params: {
              dog: dog.id,
            },
          }).then((reminders: Reminder[]) => {
            reminders = reminders.map((r: Reminder) => {
              const timeIntervalId: number = getIdFromIRI(r.timeInterval);
              // eslint-disable-next-line max-len
              r.timeIntervalDetails = timeIntervals.find((ti: TimeInterval) => ti.id === timeIntervalId);
              return r;
            });
            resolve(reminders);
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
}