<template>
  <q-popup-proxy @before-show="reset" ref="popup">
    <q-banner>
      <q-form @submit="onSubmit" v-if="reminderEditing">
        <div class="row">
          <q-input
            class="col-4 q-pr-md"
            dense
            outlined
            type="number"
            v-model.number="reminderEditing.numberTimeInterval"
          />

          <q-select
            :error="timeIntervals && timeIntervals.length === 0"
            :loading="timeIntervals === null"
            :options="timeIntervals"
            :rules="[required]"
            class="col-7 q-pr-md"
            dense
            hide-bottom-space
            option-label="displayLabel"
            option-value="internalLabel"
            outlined
            v-model="timeIntervalSelected"
          />

          <q-btn class="col-1" color="primary" dense flat icon="edit" type="submit" />
        </div>

        <div class="row">
          <q-toggle label="Mettre à jour la date de prochaine prise" v-model="updateReminder" />
        </div>
      </q-form>
    </q-banner>
  </q-popup-proxy>
</template>

<script lang="ts">
import {
  Component,
  Mixins,
  Prop,
  Watch,
} from 'vue-property-decorator';
import { Reminder } from 'src/models/reminder';
import { TimeInterval } from 'src/models/timeInterval';
import TimeIntervalRepository from 'src/repositories/TimeIntervalRepository';
import ValidationMixin from 'src/mixins/validationMixin';
import ReminderRepository from 'src/repositories/ReminderRepository';
import { getIdFromIRI } from 'src/utils/stringFormat';
import ActiveDogModule from 'src/store/modules/active-dog-module';
import DateInterval from 'src/utils/dateInterval';

@Component
export default class ReminderTimeIntervalForm extends Mixins(ValidationMixin) {
  // *** Props ***
  @Prop({ required: true }) reminder: Reminder | undefined;

  @Prop({ required: false, default: null }) lastDate: string | undefined;

  // *** Data ***
  private reminderEditing: Reminder | null = null;

  private timeIntervals: TimeInterval[] | null = null;

  private timeIntervalSelected: TimeInterval | null = null;

  private updateReminder = true;

  // *** Hooks ***
  public mounted() {
    const timeIntervalRepository = new TimeIntervalRepository();
    timeIntervalRepository.getAll().then((timeIntervals: TimeInterval[]) => {
      this.timeIntervals = timeIntervals;
    }).finally(() => {
      if (!this.timeIntervals) {
        this.timeIntervals = [];
      }
      this.setTimeIntervalSelected();
    });
  }

  // *** Methods ***
  public setTimeIntervalSelected() {
    if (
      this.timeIntervals
      && this.timeIntervals.length > 0
      && this.reminder
      && this.reminder.timeInterval) {
      const timeIntervalId: number = getIdFromIRI(this.reminder.timeInterval);
      // eslint-disable-next-line max-len
      this.timeIntervalSelected = this.timeIntervals.find((ti: TimeInterval) => ti.id === timeIntervalId) || null;
    }
  }

  public reset() {
    this.updateReminder = true;
    if (this.reminder) {
      this.reminderEditing = { ...this.reminder };
    }
    this.setTimeIntervalSelected();
  }

  // *** Events handlers ***
  public onSubmit() {
    if (this.reminderEditing && this.timeIntervalSelected) {
      const reminder: Reminder = { ...this.reminderEditing };

      const timeIntervalRepository = new TimeIntervalRepository();
      reminder.timeInterval = timeIntervalRepository
        .buildIri(this.timeIntervalSelected);

      if (this.updateReminder && this.lastDate) {
        reminder.nextReminder = DateInterval.add(
          this.lastDate,
          this.reminderEditing.numberTimeInterval,
          this.timeIntervalSelected,
        );
      }

      const reminderRepository = new ReminderRepository();
      reminderRepository.update(reminder).then(() => {
        ActiveDogModule.fetchReminders();

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        this.$refs.popup.hide();
      });
    }
  }

  // *** Watchers ***
  @Watch('reminder', { immediate: true, deep: true })
  public onReminderChanged() {
    this.reset();
  }
}
</script>

<style scoped>

</style>
