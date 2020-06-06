<template>
  <apex-chart
    :options="options"
    :series="series"
    style="width: 100%"
    type="line"
  ></apex-chart>
</template>

<script lang="ts">
import {
  Component,
  Mixins,
  Prop,
} from 'vue-property-decorator';
import DateMixin from 'src/mixins/dateMixin';
import VueApexCharts from 'vue-apexcharts';
import { Weight } from '../models/weight';

@Component({
  components: {
    ApexChart: VueApexCharts,
  },
})
export default class DogWeightChart extends Mixins(DateMixin) {
  @Prop({ required: true }) weights: Weight[] | undefined;

  public get options() {
    let categories: string[] = [];

    if (this.weights) {
      categories = this.weights.map((w) => {
        if (this.$options.filters) {
          return this.$options.filters.formatDate(w.date);
        }
        return '';
      });
    }

    return {
      chart: {
        id: 'weight-chart',
      },
      xaxis: {
        categories,
      },
      dataLabels: {
        enabled: true,
      },
    };
  }

  public get series() {
    let data: number[] = [];

    if (this.weights) {
      data = this.weights.map((w) => parseFloat(w.weight));
    }

    return [{
      name: 'Poids',
      data,
    }];
  }
}
</script>

<style scoped>

</style>
