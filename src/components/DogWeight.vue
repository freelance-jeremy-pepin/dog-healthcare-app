<template>
  <q-card v-if="weights">
    <q-card-section class="row items-center">
      <dog-weight-chart :weights="weights"></dog-weight-chart>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
} from 'vue-property-decorator';
import { Weight } from 'src/models/weight';
import DogWeightChart from 'components/DogWeightChart.vue';

@Component({
  components: {
    DogWeightChart,
  },
})
export default class DogWeight extends Vue {
  @Prop({ required: true }) weights: Weight[] | undefined;
}
</script>

<style scoped>

</style>
