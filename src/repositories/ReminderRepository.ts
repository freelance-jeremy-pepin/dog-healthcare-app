import BaseRepository from 'src/repositories/BaseRepository';
import { Dog } from 'src/models/dog';
import { Reminder } from 'src/models/reminder';

export default class ReminderRepository extends BaseRepository<Reminder> {
  constructor() {
    super('reminders');
    this.date = ['nextReminder'];
  }

  public getByDog = (dog: Dog): Promise<Reminder[]> => this.fetchMany(this.baseIri, {
    params: {
      dog: dog.id,
    },
  });
}
