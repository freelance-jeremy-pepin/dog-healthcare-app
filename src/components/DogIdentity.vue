<template>
  <q-card v-if="dog">
    <q-card-section class="row items-center">
      <q-avatar class="text-white" color="purple" size="72px">
        {{ dog.name[0] }}
      </q-avatar>


      <span class="q-ml-md">
        <span class="text-h4 row items-center">
          {{ dog.name }}
          <q-btn flat icon="unfold_more" round v-if="dogs.length > 1">
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item
                  :active="dog.id === activeDog.id"
                  :key="dog.id"
                  @click="setActiveDog(dog)"
                  clickable
                  v-close-popup
                  v-for="dog in dogs"
                >
                  <q-item-section>{{ dog.name }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </span>

        <span class="text-subtitle1 text-grey">
          {{ dog.breed }}
        </span>
      </span>
    </q-card-section>

    <q-separator></q-separator>

    <q-card-section>
      <div>
        Né le : {{ dog.birthday | formatDate }}
        <span class="text-grey text-italic">({{ age }})</span>
      </div>
      <div v-if="lastWeight">
        Poids : {{ lastWeight.weight }} kg
        <span class="text-grey text-italic" v-if="weightDateAgo">({{ weightDateAgo }})</span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import {
  Component,
  Mixins,
  Prop,
  Watch,
} from 'vue-property-decorator';
import DateMixin from 'src/mixins/dateMixin';
import moment from 'moment';
import TextFormatMixin from 'src/mixins/textFormat';
import DogModule from 'src/store/modules/dog-module';
import ActiveDogModule from 'src/store/modules/active-dog-module';
import UserModule from 'src/store/modules/user-module';
import DateTime from 'src/utils/dateTime';
import { Weight } from 'src/models/weight';
import Date from 'src/utils/date';
import { Dog } from '../models/dog';

@Component
export default class DogIdentity extends Mixins(DateMixin, TextFormatMixin) {
  // *** Props ***
  @Prop({ required: true }) dog: Dog | undefined;

  // *** Data ***
  private weightDateAgo: string | null = null;

  // *** Computed properties ***
  public get age(): string {
    if (this.dog && this.$options && this.$options.filters) {
      const a = moment();
      const b = moment(this.dog.birthday, Date.appFormat);
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

  // eslint-disable-next-line class-methods-use-this
  public get dogs(): Dog[] {
    if (DogModule.Dogs) {
      return DogModule.Dogs;
    }
    return [];
  }

  // eslint-disable-next-line class-methods-use-this
  public get activeDog(): Dog | undefined {
    if (UserModule.User?.activeDog) {
      return UserModule.User.activeDog;
    }
    return undefined;
  }

  // eslint-disable-next-line class-methods-use-this
  public get lastWeight(): Weight | null {
    if (ActiveDogModule.Weights && ActiveDogModule.Weights.length > 0) {
      return ActiveDogModule.Weights[ActiveDogModule.Weights.length - 1];
    }

    return null;
  }

  // *** Hooks ***
  public mounted() {
    setInterval(() => {
      this.refreshWeightDateAgo();
    }, 5000);
  }

  // *** Methods ***
  setActiveDog = (dog: Dog | undefined) => {
    UserModule.setActiveDog(dog);
  }

  public refreshWeightDateAgo() {
    if (this.lastWeight) {
      this.weightDateAgo = moment(this.lastWeight.date, DateTime.appFormat).fromNow();
    } else {
      this.weightDateAgo = null;
    }
  }

  // *** Watchers ***
  @Watch('dog', { immediate: true, deep: true })
  public onDogChanged(dog: Dog) {
    if (dog) {
      this.refreshWeightDateAgo();
    }
  }

  @Watch('lastWeight', { immediate: true, deep: true })
  public onLastWeightChanged(lastWeight: Weight) {
    if (lastWeight) {
      this.refreshWeightDateAgo();
    }
  }
}
</script>

<style scoped>

</style>
