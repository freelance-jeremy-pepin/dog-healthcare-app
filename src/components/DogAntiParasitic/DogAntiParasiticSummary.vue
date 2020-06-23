<template>
  <reminder-summary
    :last-date="lastAntiParasitic ? lastAntiParasitic.date : null"
    :reminder="reminder"
    label-last-date="Dernière prise"
    label-next-reminder="Prochaine prise"
  ></reminder-summary>
</template>

<script lang="ts">
import {
  Component,
  Mixins,
  Prop,
} from 'vue-property-decorator';
import DateTimeMixin from 'src/mixins/dateTimeMixin';
import ItemIcon from 'components/common/ItemIcon.vue';
import {
  Reminder,
  ReminderTableName,
} from 'src/models/reminder';
import ActiveDogModule from 'src/store/modules/active-dog-module';
import DateIntervalMixin from 'src/mixins/dateIntervalMixin';
import ReminderTimeIntervalForm from 'components/Reminder/ReminderTimeIntervalForm.vue';
import ReminderNextReminder from 'components/Reminder/ReminderNextReminder.vue';
import ReminderSummary from 'components/Reminder/ReminderSummary.vue';
import { AntiParasitic } from 'src/models/antiParasitic';

@Component({
  components: {
    ReminderSummary, ReminderNextReminder, ReminderTimeIntervalForm, ItemIcon,
  },
})
export default class DogAntiParasiticSummary extends Mixins(DateTimeMixin, DateIntervalMixin) {
  // *** Props ***
  @Prop({ required: true }) antiParasitics: AntiParasitic[] | undefined;

  // *** Computed properties ***
  // eslint-disable-next-line class-methods-use-this
  public get reminder(): Reminder | undefined {
    return ActiveDogModule.Reminder(ReminderTableName.antiParasitic);
  }

  // eslint-disable-next-line class-methods-use-this
  public get lastAntiParasitic(): AntiParasitic | null {
    return ActiveDogModule.LastAntiParasitic;
  }
}
</script>

<style scoped>

</style>
