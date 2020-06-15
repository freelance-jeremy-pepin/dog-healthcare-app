<template>
  <div>
    <item-icon
      :value="lastDeworming ? $options.filters.toDate(lastDeworming.date) : 'Jamais'"
      icon="history"
      title="Dernière application"
    />
  </div>
</template>

<script lang="ts">
import {
  Component,
  Mixins,
  Prop,
  Watch,
} from 'vue-property-decorator';
import DateTimeMixin from 'src/mixins/dateTimeMixin';
import { Deworming } from 'src/models/deworming';
import ItemIcon from 'components/common/ItemIcon.vue';

@Component({
  components: { ItemIcon },
})
export default class DogDewormingSummary extends Mixins(DateTimeMixin) {
  // *** Props ***
  @Prop({ required: true }) dewormings: Deworming[] | undefined;

  // *** Data ***
  private lastDeworming: Deworming | null = null;

  // *** Watchers ***
  @Watch('dewormings', { deep: true, immediate: true })
  public onDewormingsChanged() {
    if (this.dewormings && this.dewormings?.length > 0) {
      // eslint-disable-next-line prefer-destructuring
      this.lastDeworming = this.dewormings[0];
    }
  }
}
</script>

<style scoped>

</style>
