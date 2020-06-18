<template>
  <dialog-form
    :is-editing="!!weight"
    @reset="reset"
    @submit="onSubmit"
    ref="modal"
    v-bind="$attrs"
    v-model="$attrs.value"
    v-on="$listeners"
    title="%labelAction% un poids pour %activeDog.name%"
  >
    <template v-if="weightEditing" v-slot:form>
      <q-input :rules="[required]" label="Date" outlined v-model="weightEditing.date">
        <template v-slot:append>
          <q-icon class="cursor-pointer" name="event">
            <q-popup-proxy ref="qDateProxy" transition-hide="scale" transition-show="scale">
              <q-date
                :options="limitDatesNoFutur"
                @input="() => $refs.qDateProxy.hide()"
                mask="DD/MM/YYYY"
                today-btn
                v-model="weightEditing.date"
              />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <q-input
        :rules="[required,floatValidation]"
        label="Poids"
        outlined
        v-model="weightEditing.weight"
      >
        <template v-slot:append>
          kg
        </template>
      </q-input>
    </template>
  </dialog-form>
</template>

<script lang="ts">
import {
  Component,
  Mixins,
  Prop,
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
import DialogForm from 'components/common/DialogForm.vue';

@Component({
  components: { DialogForm },
})
export default class DogWeightForm extends Mixins(ValidationMixin, DateMixin) {
  // *** Props ***
  @Prop({ required: false, default: undefined }) weight: Weight | undefined;

  // *** Data ***
  private weightEditing: Weight | null = null;

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
    if (this.weight) {
      this.weightEditing = { ...this.weight };
    } else {
      this.weightEditing = this.emptyWeight();
    }
  }

  public submitSuccessCallback() {
    ActiveDogModule.fetchWeights();

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    this.$refs.modal.hide();
  }

  // *** Events handlers ***
  public onSubmit() {
    if (this.weightEditing) {
      const weight: Weight = { ...this.weightEditing };

      const weightRepository = new WeightRepository();
      if (this.weight) {
        weightRepository.update(weight).then(() => {
          this.submitSuccessCallback();
        });
      } else {
        weightRepository.add(weight).then(() => {
          this.submitSuccessCallback();
        });
      }
    }
  }
}
</script>

<style scoped>

</style>
