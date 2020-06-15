import {
  Component,
  Vue,
} from 'vue-property-decorator';
import { TimeInterval } from 'src/models/timeInterval';
import moment from 'moment';
import DateTime from 'src/utils/dateTime';

@Component({
  filters: {
    formatPeriodicity(number: number, timeInterval: TimeInterval) {
      const numberLabel = number < 2 ? '' : number.toString();
      let timeIntervalLabel = timeInterval.displayLabel.toLowerCase();

      if (!timeIntervalLabel.endsWith('s')) {
        timeIntervalLabel = `${timeIntervalLabel}s`;
      }

      return `Se répète tous les ${numberLabel} ${timeIntervalLabel}`;
    },

    color(date: string): string {
      const dateMoment = moment(date, DateTime.appFormat);
      const daysDiff = dateMoment.diff(moment(), 'days', true);

      if (daysDiff < 3 && daysDiff > -4) {
        return 'orange';
      }

      if (daysDiff <= -4) {
        return 'red';
      }

      return '';
    },

    ago(date: string): string {
      const dateMoment = moment(date, DateTime.appFormat);
      const daysDiff = dateMoment.diff(moment(), 'days', true);

      if (daysDiff < 1 && daysDiff > -2) {
        return moment(date, DateTime.appFormat).calendar(null, {
          sameDay: '[Aujourd\'hui]',
          nextDay: '[Demain]',
          nextWeek: 'dddd',
          lastDay: '[Hier]',
          lastWeek: '[Last] dddd',
          sameElse: 'DD/MM/YYYY',
        });
      }

      return dateMoment.add(1, 'day').fromNow();
    },
  },
})
export default class DateIntervalMixin extends Vue {
}
