import {
  Component,
  Vue,
} from 'vue-property-decorator';
import moment from 'moment';

@Component({
  filters: {
    formatDate(value: string) {
      return moment(String(value)).format('DD/MM/YYYY');
    },
  },
})
export default class DateMixin extends Vue {

}
