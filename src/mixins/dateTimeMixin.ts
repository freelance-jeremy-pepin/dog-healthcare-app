import {
  Component,
  Vue,
} from 'vue-property-decorator';
import moment from 'moment';
import DateTime from 'src/utils/dateTime';

@Component({
  filters: {
    formatDate(value: string) {
      return moment(String(value), DateTime.appFormat).format('DD/MM/YYYY');
    },
  },
})
export default class DateTimeMixin extends Vue {

}
