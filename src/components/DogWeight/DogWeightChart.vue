<template>
    <apex-chart
        :options="options"
        :series="series"
        type="line"
    />
</template>

<script lang="ts">
import {
    Component,
    Mixins,
    Prop,
} from 'vue-property-decorator';
import VueApexCharts from 'vue-apexcharts';
import { Weight } from 'src/models/weight';
import DateTimeMixin from 'src/mixins/dateTimeMixin';

@Component({
    components: {
        ApexChart: VueApexCharts,
    },
})
export default class DogWeightChart extends Mixins(DateTimeMixin) {
    // region Props

    @Prop({ required: true }) weights: Weight[] | undefined;

    // endregion

    // region Computed properties
    public get options() {
        let categories: string[] = [];

        if (this.weights) {
            categories = this.weights.map((w) => {
                if (this.$options.filters) {
                    return this.$options.filters.toDate(w.date);
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

    // endregion
}
</script>
