<template>
  <q-card v-if="dewormings">
    <q-card-section class="row items-center q-pb-xs">
      <div class="text-subtitle2">Vermifuges</div>
    </q-card-section>

    <q-card-section class="q-pt-xs">
      <dog-deworming-summary
        :dewormings="dewormings"
        v-if="displayMode.CurrentDisplayMode.key === 'summary'"
      ></dog-deworming-summary>

      <dog-deworming-table
        :dewormings="dewormings"
        v-if="displayMode.CurrentDisplayMode.key === 'history'"
      ></dog-deworming-table>
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
import { Deworming } from 'src/models/deworming';
import DogDewormingTable from 'components/DogDeworming/DogDewormingTable.vue';
import DisplayMode, { DisplayModeInterface } from 'src/utils/displayMode';
import DogDewormingSummary from 'components/DogDeworming/DogDewormingSummary.vue';

@Component({
  components: {
    DogDewormingSummary,
    DogDewormingTable,
  },
})
export default class DogDeworming extends Vue {
  // *** Props ***
  @Prop({ required: true }) dewormings: Deworming[] | undefined;

  // *** Data ***
  private displayMode: DisplayMode | null = null;

  // *** Hooks ***
  public mounted() {
    const displayModes: DisplayModeInterface[] = [
      { key: 'summary', icon: 'dehaze', label: 'Vue d\'ensemble' },
      { key: 'history', icon: 'history', label: 'Historique' },
    ];
    this.displayMode = new DisplayMode(displayModes, 'DogDeworming.displayMode');
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
