<template>
  <div>
    <expandable-card key-local-storage="DogWeight" v-if="weights">
      <template v-slot:header-label>
        Poids
      </template>

      <template v-slot:header-sub-label>
        <span v-if="lastWeight">{{ lastWeight.weight }} kg</span>
        <span v-else>Aucun poids</span>
      </template>

      <template v-slot:header-buttons>
        <expandable-card-button @click.stop="chartDisplay = true" color="blue" icon="show_chart" />
        <expandable-card-button @click.stop="historyDisplay = true" color="grey" icon="history" />
        <expandable-card-button @click.stop="formDisplay = true" color="green" icon="add" />
      </template>

      <template v-slot:content>
        <dog-weight-summary />
      </template>
    </expandable-card>

    <dog-weight-form v-model="formDisplay"></dog-weight-form>

    <q-dialog v-model="historyDisplay">
      <dog-weight-table :weights="weights"></dog-weight-table>
    </q-dialog>

    <q-dialog style="width: 50%" v-model="chartDisplay">
      <q-card class="q-pa-md full-width">
        <dog-weight-chart :weights="weights"></dog-weight-chart>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
} from 'vue-property-decorator';
import { Weight } from 'src/models/weight';
import DogWeightChart from 'components/DogWeight/DogWeightChart.vue';
import DogWeightTable from 'components/DogWeight/DogWeightTable.vue';
import DogWeightForm from 'components/DogWeight/DogWeightForm.vue';
import DogWeightSummary from 'components/DogWeight/DogWeightSummary.vue';
import ActiveModule from 'src/store/modules/active-dog-module';
import ExpandableCard from 'components/common/ExpandableCard/ExpandableCard.vue';
import ExpandableCardButton from 'components/common/ExpandableCard/ExpandableCardButton.vue';

@Component({
  components: {
    ExpandableCardButton,
    ExpandableCard,
    DogWeightSummary,
    DogWeightForm,
    DogWeightChart,
    DogWeightTable,
  },
})
export default class DogWeight extends Vue {
  // *** Props ***
  @Prop({ required: true }) weights: Weight[] | undefined;

  // *** Data ***
  private formDisplay = false;

  private historyDisplay = false;

  private chartDisplay = false;

  // *** Computed properties ***
  // eslint-disable-next-line class-methods-use-this
  public get lastWeight(): Weight | null {
    return ActiveModule.LastWeight;
  }
}
</script>

<style scoped>

</style>
