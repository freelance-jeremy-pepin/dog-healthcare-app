<!--suppress ALL -->
<template>
  <q-card v-if="weights">
    <q-card-section class="row items-center q-pb-xs">
      <div class="text-subtitle2">Poids</div>
    </q-card-section>

    <q-card-section class="q-pt-xs">
      <dog-weight-table
        :weights="weights"
        v-show="displayMode.CurrentDisplayMode.key === 'table'"
      />
      <dog-weight-chart
        :weights="weights"
        v-show="displayMode.CurrentDisplayMode.key === 'chart'"
      />
    </q-card-section>

    <q-separator />

    <q-card-actions v-if="displayMode" vertical>
      <q-btn
        :icon-right="displayMode.NextDisplayMode.icon"
        :label="displayMode.NextDisplayMode.label"
        @click="displayMode.next()"
        flat
      />
    </q-card-actions>
  </q-card>
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
import DisplayMode, { DisplayModeInterface } from 'src/utils/displayMode';

@Component({
  components: {
    DogWeightChart,
    DogWeightTable,
  },
})
export default class DogWeight extends Vue {
  // *** Props ***
  @Prop({ required: true }) weights: Weight[] | undefined;

  // *** Data ***
  private displayMode: DisplayMode | null = null;

  // *** Hooks ***
  public mounted() {
    const displayModes: DisplayModeInterface[] = [
      { key: 'chart', icon: 'show_chart', label: 'Graphique' },
      { key: 'table', icon: 'list', label: 'Tableau' },
    ];
    this.displayMode = new DisplayMode(displayModes, 'DogWeight.displayMode');
    this.displayMode.restore();
  }

  // *** Methods ***
  public nextDisplayMode() {
    if (this.displayMode) {
      this.displayMode.next();
    }
  }
}
</script>

<style scoped>

</style>
