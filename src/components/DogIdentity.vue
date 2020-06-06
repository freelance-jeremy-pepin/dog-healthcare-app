<template>
  <q-card v-if="dog">
    <q-card-section class="row items-center">
      <q-avatar class="text-white" color="purple" size="72px">
        {{ dog.name[0] }}
      </q-avatar>

      <span class="q-ml-md">
        <span class="text-h4">
          {{ dog.name }}
        </span>
        <br>
        <span class="text-subtitle1 text-grey">
          {{ dog.breed }}
        </span>
      </span>
    </q-card-section>

    <q-separator></q-separator>

    <q-card-section>
      Né le : {{ dog.birthday | formatDate }}
      <span class="text-grey text-italic">({{ age }})</span>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import {
  Component,
  Mixins,
  Prop,
} from 'vue-property-decorator';
import DateMixin from 'src/mixins/dateMixin';
import moment from 'moment';
import TextFormatMixin from 'src/mixins/textFormat';
import { Dog } from '../models/dog';

@Component
export default class DogIdentity extends Mixins(DateMixin, TextFormatMixin) {
  @Prop({ required: true }) dog: Dog | undefined;

  public get age(): string {
    if (this.dog && this.$options && this.$options.filters) {
      const a = moment();
      const b = moment(this.dog.birthday);
      const age = moment.duration(a.diff(b));
      const years = age.years();
      const months = age.months();
      const days = age.days();

      const detailedAge = [];
      if (years > 0) {
        detailedAge.push(`${years} ${this.$options.filters.pluralize(years, 'an', 'ans')}`);
      }
      if (months > 0) {
        detailedAge.push(`${months} mois`);
      }
      if (days > 0) {
        detailedAge.push(`${days} ${this.$options.filters.pluralize(days, 'jour', 'jours')}`);
      }

      return detailedAge.join(', ');
    }

    return '';
  }
}
</script>

<style scoped>

</style>
