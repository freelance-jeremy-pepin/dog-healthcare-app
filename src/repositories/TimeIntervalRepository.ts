import BaseRepository from 'src/repositories/BaseRepository';
import { TimeInterval } from 'src/models/timeInterval';

export default class TimeIntervalRepository extends BaseRepository<TimeInterval> {
  constructor() {
    super('time_intervals');
  }
}
