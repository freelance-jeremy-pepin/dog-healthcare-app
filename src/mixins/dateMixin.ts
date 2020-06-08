import {
  Component,
  Vue,
} from 'vue-property-decorator';
import moment from 'moment';
import Date from 'src/utils/date';

@Component({
  filters: {
    formatDate(value: string) {
      return moment(String(value), Date.appFormat).format('DD/MM/YYYY');
    },
  },
})
export default class DateMixin extends Vue {

}
