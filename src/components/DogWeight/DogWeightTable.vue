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
        <q-td :props="props" @click="setWeightEditing(props.row)" key="date">
          {{ props.row.date | formatDate }}
          <q-popup-proxy
            @before-show="setWeightEditing(props.row)"
            @before-hide="saveWeight(weightEditing)"
          >
            <q-date
              bordered
              flat
              mask="YYYY-MM-DD"
              v-if="weightEditing"
              v-model="weightEditing.date"
              @close="saveWeight(weightEditing)"
              :options="limitDates"
              today-btn
            />
          </q-popup-proxy>
        </q-td>

        <q-td :props="props" @click="setWeightEditing(props.row)" key="weight">
          {{ props.row.weight }}
          <q-popup-edit
            @save="saveWeight(weightEditing)"
            buttons
            v-if="weightEditing"
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

        <q-td :props="props" key="weight">
          <q-btn @click="deleteWeight(props.row)" label="DEL"></q-btn>
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
import DateMixin from 'src/mixins/dateMixin';
import ActiveDogModule from 'src/store/modules/active-dog-module';
import moment from 'moment';
import WeightRepository from 'src/repositories/WeightRepository';

@Component({
  components: {
    DogWeightChart,
  },
})
export default class DogWeightTable extends Mixins(DateMixin) {
  @Prop({ required: true }) weights: Weight[] | undefined;

  private weightEditing: Weight | null = this.weights ? this.weights[0] : null;

  private columns = [
    {
      name: 'date',
      label: 'Date',
      align: 'left',
    },
    {
      name: 'weight',
      label: 'Poids',
    },
    {
      name: 'action',
      label: '',
    },
  ];

  public setWeightEditing(weight: Weight) {
    this.weightEditing = { ...weight };
  }

  public saveWeight = (weight: Weight) => {
    ActiveDogModule.updateWeight(weight);
  };

  public limitDates = (date: string) => date <= moment().format('YYYY/MM/DD');

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