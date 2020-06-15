import {
  Component,
  Vue,
} from 'vue-property-decorator';

@Component({
  filters: {
    pluralize(count: number, singular: string, plural: string): string {
      if (count === 0 || count === 1) {
        return singular;
      }
      return plural;
    },

    phoneNumber(phoneNumber: string): string {
      return phoneNumber.toString().replace(/\B(?=(\d{2})+(?!\d))/g, ' ');
    },

    address(address: string, city: string, zipCode: string): string {
      const zipCodeFormatted = [zipCode, city].join(' ');
      if (!city && !zipCode) {
        return address;
      }
      if (!address && (city || zipCode)) {
        return zipCodeFormatted;
      }

      return [address, zipCodeFormatted].join(', ');
    },
  },
})
export default class TextFormatMixin extends Vue {

}
