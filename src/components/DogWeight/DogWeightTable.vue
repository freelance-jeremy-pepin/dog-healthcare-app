<template>
  <div>
    <table-edit
      :columns="columns"
      :data="weights"
      @delete="deleteWeight"
      @edit="editWeight"
      title="Poids"
    >
      <template v-slot:rows="props">
        <q-td :props="props.props" @click="setWeightEditing(props.props.row)" key="date">
          {{ props.props.row.date | toDate }}
          <q-popup-proxy
            @before-show="setWeightEditing(props.props.row)"
            @before-hide="saveWeight(weightEditing)"
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

        <q-td :props="props.props" @click="setWeightEditing(props.props.row)" key="weight">
          {{ props.props.row.weight }}
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
      </template>
    </table-edit>

    <dog-weight-form
      :weight="dogWeightForm.weight"
      v-model="dogWeightForm.display"
    ></dog-weight-form>
  </div>
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
import DogWeightForm from 'components/DogWeight/DogWeightForm.vue';
import TableEdit from 'components/common/TableEdit.vue';

@Component({
  components: {
    TableEdit,
    DogWeightForm,
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

  private dogWeightForm = {
    display: false,
    weight: {} as Weight,
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

  public editWeight = (weight: Weight) => {
    this.dogWeightForm.weight = weight;
    this.dogWeightForm.display = true;
  };
}
</script>

<style scoped>

</style>
