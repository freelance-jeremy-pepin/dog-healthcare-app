import {
  Component,
  Vue,
} from 'vue-property-decorator';
import moment from 'moment';
import Date from 'src/utils/date';
import DateTime from 'src/utils/dateTime';

@Component({
  filters: {
    toDateTime(value: string) {
      return moment(String(value), Date.appFormat).format(DateTime.appFormat);
    },
  },
})
export default class DateMixin extends Vue {
  public limitDatesNoFutur = (date: string) => date <= moment().format('YYYY/MM/DD');
}
