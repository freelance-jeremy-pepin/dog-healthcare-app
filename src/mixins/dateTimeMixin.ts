import {
  Component,
  Vue,
} from 'vue-property-decorator';
import moment from 'moment';
import DateTime from 'src/utils/dateTime';
import Date from 'src/utils/date';

@Component({
  filters: {
    toDate(value: string) {
      return moment(String(value), DateTime.appFormat).format(Date.appFormat);
    },
  },
})
export default class DateTimeMixin extends Vue {

}
