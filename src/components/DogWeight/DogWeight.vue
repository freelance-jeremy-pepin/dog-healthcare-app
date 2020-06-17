<template>
  <div>
    <q-card v-if="weights">
      <q-card-section>
        <q-btn
          @click="formDisplay = true"
          class="absolute"
          color="positive"
          icon="add"
          outline
          round
          size="sm"
          style="top: 35px; right: 17px; transform: translateY(-50%);"
        />

        <q-btn
          @click="chartDisplay = true"
          class="absolute"
          color="primary"
          icon="show_chart"
          outline
          round
          size="sm"
          style="top: 35px; right: 52px; transform: translateY(-50%);"
        />

        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">
            Poids
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-xs">
        <dog-weight-summary />
      </q-card-section>

      <q-card-actions class="row justify-center">
        <q-btn
          :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          @click="expanded = !expanded"
          color="grey"
          dense
          flat
          round
        />
      </q-card-actions>

      <q-slide-transition>
        <div v-show="expanded">
          <q-separator />
          <q-card-section class="q-pa-none">
            <dog-weight-table :weights="weights"></dog-weight-table>
          </q-card-section>
        </div>
      </q-slide-transition>
    </q-card>

    <dog-weight-add v-model="formDisplay"></dog-weight-add>
    <dog-weight-chart :weights="weights" v-model="chartDisplay"></dog-weight-chart>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
  Watch,
} from 'vue-property-decorator';
import { Weight } from 'src/models/weight';
import DogWeightChart from 'components/DogWeight/DogWeightChart.vue';
import DogWeightTable from 'components/DogWeight/DogWeightTable.vue';
import DogWeightAdd from 'components/DogWeight/DogWeightAdd.vue';
import DogWeightSummary from 'components/DogWeight/DogWeightSummary.vue';

@Component({
  components: {
    DogWeightSummary,
    DogWeightAdd,
    DogWeightChart,
    DogWeightTable,
  },
})
export default class DogWeight extends Vue {
  // *** Props ***
  @Prop({ required: true }) weights: Weight[] | undefined;

  // *** Data ***
  private expanded = false;

  private formDisplay = false;

  private chartDisplay = false;

  // *** Hooks ***
  public mounted() {
    const expandedLocalStorage = localStorage.getItem('DogWeight.expanded');
    if (expandedLocalStorage) {
      this.expanded = expandedLocalStorage === 'true';
    }
  }

  // *** Watchers ***
  @Watch('expanded')
  // eslint-disable-next-line class-methods-use-this
  public onExpandedChanged(value: boolean) {
    localStorage.setItem('DogWeight.expanded', value.toString());
  }
}
</script>

<style scoped>

</style>
