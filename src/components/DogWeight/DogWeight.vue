<!--suppress ALL -->
<template>
  <q-card v-if="weights">
    <q-card-section class="row items-center">
      <dog-weight-table
        :weights="weights"
        v-show="currentDisplayMode.key === 'table'"
      />
      <dog-weight-chart
        :weights="weights"
        v-show="currentDisplayMode.key === 'chart'"
      />
    </q-card-section>

    <q-separator />

    <q-card-actions vertical>
      <q-btn
        :icon-right="nextDisplayMode.icon"
        :label="nextDisplayMode.label"
        @click="changeDisplayMode"
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

interface DisplayMode {
  key: 'chart' | 'table';
  icon: string;
  label: string;
}

@Component({
  components: {
    DogWeightChart,
    DogWeightTable,
  },
})
export default class DogWeight extends Vue {
  @Prop({ required: true }) weights: Weight[] | undefined;

  private displayModes: DisplayMode[] = [
    { key: 'chart', icon: 'show_chart', label: 'Graphique' },
    { key: 'table', icon: 'list', label: 'Tableau' },
  ];

  private currentDisplayMode: DisplayMode = this.displayModes[0];

  public get nextDisplayMode(): DisplayMode {
    const indexCurrentDisplayMode = this.displayModes.findIndex(
      (value) => value.key === this.currentDisplayMode.key,
    );

    if (indexCurrentDisplayMode >= this.displayModes.length - 1) {
      return this.displayModes[0];
    }

    return this.displayModes[indexCurrentDisplayMode + 1];
  }

  public mounted() {
    const displayModeLocalStorage: string | null = window.localStorage.getItem('DogWeight.displayMode');
    if (displayModeLocalStorage) {
      this.currentDisplayMode = JSON.parse(displayModeLocalStorage);
    }
  }

  public changeDisplayMode() {
    this.currentDisplayMode = this.nextDisplayMode;
    window.localStorage.setItem('DogWeight.displayMode', JSON.stringify(this.currentDisplayMode));
  }
}
</script>

<style scoped>

</style>
