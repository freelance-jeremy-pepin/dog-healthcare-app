<template>
  <div>
    <item-icon
      :value="lastDeworming ? $options.filters.toDate(lastDeworming.date) : 'Jamais'"
      icon="history"
      title="Dernière application"
    />

    <item-icon
      :color="reminder.nextReminder | color"
      :value="reminder ? `${reminder.nextReminder} (${$options.filters.ago(reminder.nextReminder)})`
       : 'Non planifié'"
      icon="schedule"
      title="Prochaine application"
      v-if="reminder"
    />

    <item-icon
      :title="this.$options.filters.formatPeriodicity(
        reminder.numberTimeInterval,
        reminder.timeInterval)"
      icon="notifications"
      v-if="reminder"
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
import {
  Reminder,
  ReminderTableName,
} from 'src/models/reminder';
import ActiveDogModule from 'src/store/modules/active-dog-module';
import DateIntervalMixin from 'src/mixins/dateIntervalMixin';

@Component({
  components: { ItemIcon },
})
export default class DogDewormingSummary extends Mixins(DateTimeMixin, DateIntervalMixin) {
  // *** Props ***
  @Prop({ required: true }) dewormings: Deworming[] | undefined;

  // *** Data ***
  private lastDeworming: Deworming | null = null;

  // *** Computed properties ***
  // eslint-disable-next-line class-methods-use-this
  public get reminder(): Reminder | undefined {
    return ActiveDogModule.Reminder(ReminderTableName.deworming);
  }

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
