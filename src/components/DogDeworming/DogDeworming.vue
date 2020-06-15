<template>
  <q-card v-if="dewormings">
    <q-card-section class="row items-center">
      <div class="text-subtitle2">Vermifuges</div>
      <dog-deworming-table :dewormings="dewormings"></dog-deworming-table>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
} from 'vue-property-decorator';
import { Deworming } from 'src/models/deworming';
import DogDewormingTable from 'components/DogDeworming/DogDewormingTable.vue';

@Component({
  components: {
    DogDewormingTable,
  },
})
export default class DogDeworming extends Vue {
  // *** Props ***
  @Prop({ required: true }) dewormings: Deworming[] | undefined;
}
</script>

<style scoped>

</style>
