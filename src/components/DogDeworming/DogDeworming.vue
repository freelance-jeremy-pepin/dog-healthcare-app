<template>
  <div>
    <q-card v-if="dewormings">
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

        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">
            Vermifuges
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-xs">
        <dog-deworming-summary :dewormings="dewormings" />
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
            <dog-deworming-table :dewormings="dewormings" />
          </q-card-section>
        </div>
      </q-slide-transition>
    </q-card>

    <dog-deworming-form v-model="formDisplay"></dog-deworming-form>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
  Watch,
} from 'vue-property-decorator';
import { Deworming } from 'src/models/deworming';
import DogDewormingTable from 'components/DogDeworming/DogDewormingTable.vue';
import DogDewormingSummary from 'components/DogDeworming/DogDewormingSummary.vue';
import DogDewormingForm from 'components/DogDeworming/DogDewormingForm.vue';

@Component({
  components: {
    DogDewormingForm,
    DogDewormingSummary,
    DogDewormingTable,
  },
})
export default class DogDeworming extends Vue {
  // *** Props ***
  @Prop({ required: true }) dewormings: Deworming[] | undefined;

  // *** Data ***
  private expanded = false;

  private formDisplay = false;

  // *** Hooks ***
  public mounted() {
    const expandedLocalStorage = localStorage.getItem('DogDeworming.expanded');
    if (expandedLocalStorage) {
      this.expanded = expandedLocalStorage === 'true';
    }
  }

  // *** Watchers ***
  @Watch('expanded')
  // eslint-disable-next-line class-methods-use-this
  public onExpandedChanged(value: boolean) {
    localStorage.setItem('DogDeworming.expanded', value.toString());
  }
}
</script>

<style scoped>

</style>
