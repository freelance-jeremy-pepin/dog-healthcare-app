import moment from 'moment';
import Date from 'src/utils/date';
import { TimeInterval } from 'src/models/timeInterval';

export default class DateInterval {
    public static add(date: string, numberTimeInterval: number, timeInterval: TimeInterval): string {
        if (timeInterval.format) {
            return moment(date, Date.appFormat)
                .add(numberTimeInterval, timeInterval.format)
                .format(Date.appFormat);
        }

        return '';
    }
}
