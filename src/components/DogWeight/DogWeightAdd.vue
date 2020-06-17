<template>
  <q-dialog
    @before-show="reset"
    position="bottom"
    ref="modal"
    v-bind="$attrs"
    v-if="activeDog"
    v-model="$attrs.value"
    v-on="$listeners"
  >
    <q-card>
      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">Ajouter un poids pour {{ activeDog.name }}</div>
        <q-form @submit="onSubmit" class="column q-gutter-md">
          <q-input :rules="[required]" label="Date" outlined v-model="newWeight.date">
            <template v-slot:append>
              <q-icon class="cursor-pointer" name="event">
                <q-popup-proxy ref="qDateProxy" transition-hide="scale" transition-show="scale">
                  <q-date
                    :options="limitDatesNoFutur"
                    @input="() => $refs.qDateProxy.hide()"
                    mask="DD/MM/YYYY"
                    today-btn
                    v-model="newWeight.date"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input
            :rules="[required,floatValidation]"
            label="Poids"
            outlined
            v-model="newWeight.weight"
          >
            <template v-slot:append>
              kg
            </template>
          </q-input>

          <q-btn color="positive" label="Ajouter" type="submit" />
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  Component,
  Mixins,
} from 'vue-property-decorator';
import { Weight } from 'src/models/weight';
import ActiveDogModule from 'src/store/modules/active-dog-module';
import DogRepository from 'src/repositories/DogRepository';
import { Dog } from 'src/models/dog';
import moment from 'moment';
import WeightRepository from 'src/repositories/WeightRepository';
import Date from 'src/utils/date';
import ValidationMixin from 'src/mixins/validationMixin';
import DateMixin from 'src/mixins/dateMixin';

@Component
export default class DogWeightAdd extends Mixins(ValidationMixin, DateMixin) {
  // *** Data ***
  private newWeight: Weight = this.emptyWeight();

  // *** Computed properties ***

  // eslint-disable-next-line class-methods-use-this
  public get activeDog(): Dog | undefined {
    return ActiveDogModule.Dog;
  }

  // *** Methods ***
  public emptyWeight(): Weight {
    return {
      dog: `${(new DogRepository().BaseIri)}/${this.activeDog?.id}`,
      weight: '',
      date: moment().format(Date.appFormat),
    };
  }

  public reset() {
    this.newWeight = this.emptyWeight();
  }

  // *** Events handlers ***
  public onSubmit() {
    const weight: Weight = { ...this.newWeight };

    const weightRepository = new WeightRepository();
    weightRepository.add(weight).then(() => {
      ActiveDogModule.fetchWeights();

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      this.$refs.modal.hide();
    });
  }
}
</script>

<style scoped>

</style>
