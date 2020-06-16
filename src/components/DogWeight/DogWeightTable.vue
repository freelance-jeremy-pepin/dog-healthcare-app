<template>
  <q-table
    :columns="columns"
    :data="weights"
    bordered
    dense
    flat
    row-key="id"
    style="width: 100%"
    v-if="weights"
  >
    <template v-slot:body="props">
      <q-tr :props="props">

        <q-menu context-menu touch-position v-if="isEditing">
          <q-item
            @click="deleteWeight(props.row)"
            class="bg-negative text-white"
            clickable
            v-close-popup
          >
            <q-item-section side>
              <q-icon color="white" name="delete" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-white">Supprimer</q-item-label>
            </q-item-section>
          </q-item>
        </q-menu>

        <q-td :props="props" @click="setWeightEditing(props.row)" key="date">
          {{ props.row.date | toDate }}
          <q-popup-proxy
            @before-show="setWeightEditing(props.row)"
            @before-hide="saveWeight(weightEditing)"
            v-if="isEditing"
          >
            <q-date
              bordered
              flat
              mask="DD/MM/YYYY"
              v-if="weightEditing"
              v-model="weightEditing.date"
              @close="saveWeight(weightEditing)"
              :options="limitDatesNoFutur"
              today-btn
            />
          </q-popup-proxy>
        </q-td>

        <q-td :props="props" @click="setWeightEditing(props.row)" key="weight">
          {{ props.row.weight }}
          <q-popup-edit
            @save="saveWeight(weightEditing)"
            buttons
            v-if="weightEditing && isEditing"
            v-model="weightEditing.weight"
          >
            <q-input
              autofocus
              dense
              v-model="weightEditing.weight"
              @focus="$event.target.select()"
            />
          </q-popup-edit>
        </q-td>
      </q-tr>
    </template>

  </q-table>

</template>

<script lang="ts">
import {
  Component,
  Mixins,
  Prop,
} from 'vue-property-decorator';
import { Weight } from 'src/models/weight';
import DogWeightChart from 'components/DogWeight/DogWeightChart.vue';
import ActiveDogModule from 'src/store/modules/active-dog-module';
import moment from 'moment';
import WeightRepository from 'src/repositories/WeightRepository';
import DateTimeMixin from 'src/mixins/dateTimeMixin';
import DateMixin from 'src/mixins/dateMixin';

@Component({
  components: {
    DogWeightChart,
  },
})
export default class DogWeightTable extends Mixins(DateTimeMixin, DateMixin) {
  // *** Props ***
  @Prop({ required: true }) weights: Weight[] | undefined;

  // *** Data ***
  private weightEditing: Weight | null = this.weights ? this.weights[0] : null;

  private columns = [
    {
      name: 'date',
      label: 'Date',
      align: 'left',
    },
    {
      name: 'weight',
      label: 'Poids (kg)',
    },
  ];

  // *** Computed properties ***
  // eslint-disable-next-line class-methods-use-this
  public get isEditing(): boolean {
    return ActiveDogModule.IsEditing;
  }

  // *** Methods ***
  public setWeightEditing(weight: Weight) {
    this.weightEditing = { ...weight };
  }

  public saveWeight = (weight: Weight) => {
    weight.date += ` ${moment().format('HH:mm:ss')}`;
    ActiveDogModule.updateWeight(weight);
  };

  public deleteWeight = (weight: Weight) => {
    const weightRepository = new WeightRepository();
    weightRepository.delete(weight).then(() => {
      ActiveDogModule.fetchWeights();
    });
  };
}
</script>

<style scoped>

</style>
