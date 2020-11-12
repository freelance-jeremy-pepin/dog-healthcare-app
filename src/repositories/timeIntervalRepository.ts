import BaseRepository from 'src/repositories/baseRepository';
import { TimeInterval } from 'src/models/timeInterval';

export enum TimeIntervalRelations {
    user = 'user',
}

// eslint-disable-next-line max-len
export default class TimeIntervalRepository extends BaseRepository<TimeInterval, TimeIntervalRelations> {
    constructor() {
        super('time-interval');
    }
}
