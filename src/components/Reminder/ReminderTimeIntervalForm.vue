<template>
    <q-popup-proxy ref="popup" @before-show="reset">
        <q-banner>
            <q-form v-if="internalReminder" @submit="onSubmit">
                <div class="row">
                    <q-input
                        v-model.number="internalReminder.numberTimeInterval"
                        class="col-4 q-pr-md"
                        dense
                        outlined
                        type="number"
                    />

                    <q-select
                        v-model="internalReminder.timeInterval"
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
                        v-on:input="internalReminder.timeIntervalId = internalReminder.timeInterval.id"
                    />

                    <q-btn class="col-1" color="primary" dense flat icon="edit" type="submit" />
                </div>

                <div class="row">
                    <q-toggle
                        v-model="mustUpdateReminder"
                        label="Mettre à jour la date de prochaine prise"
                    />
                </div>
            </q-form>
        </q-banner>
    </q-popup-proxy>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
import { Reminder } from 'src/models/reminder';
import { TimeInterval } from 'src/models/timeInterval';
import TimeIntervalRepository from 'src/repositories/timeIntervalRepository';
import ValidationMixin from 'src/mixins/validationMixin';
import ReminderRepository from 'src/repositories/reminderRepository';
import ActiveDogModule from 'src/store/modules/active-dog-module';
import DateInterval from 'src/utils/dateInterval';

@Component

export default class ReminderTimeIntervalForm extends Mixins(ValidationMixin) {
    // region Props

    @Prop({ required: true }) reminder: Reminder | undefined;

    @Prop({ required: false, default: null }) lastDate: string | undefined;

    // endregion

    // region Data

    private internalReminder: Reminder | null = null;

    private timeIntervals: TimeInterval[] | null = null;

    private mustUpdateReminder = true;

    // endregion

    // region Hooks

    private mounted() {
        this.getAllTimeIntervals();
    }

    // endregion

    // region Methods

    private reset() {
        this.mustUpdateReminder = true;
        if (this.reminder) {
            this.internalReminder = { ...this.reminder };
        }
    }

    // endregion

    // region Events handlers

    private onSubmit() {
        if (this.internalReminder) {
            const reminder: Reminder = { ...this.internalReminder };

            if (this.mustUpdateReminder && this.lastDate && this.internalReminder.timeInterval) {
                reminder.nextReminder = DateInterval.add(
                    this.lastDate,
                    this.internalReminder.numberTimeInterval,
                    this.internalReminder.timeInterval,
                );
            }

            this.updateReminder(reminder);
        }
    }

    // endregion

    // region Methods

    private getAllTimeIntervals() {
        new TimeIntervalRepository().getAll()
            .then((timeIntervals: TimeInterval[]) => {
                this.timeIntervals = timeIntervals;
            });
    }

    private updateReminder(reminder: Reminder) {
        new ReminderRepository().update(reminder)
            .then(() => {
                ActiveDogModule.fetchReminders();

                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                this.$refs.popup.hide();
            });
    }

    // endregion

    // region Watchers

    @Watch('reminder', { immediate: true, deep: true })
    private onReminderChanged() {
        this.reset();
    }

    // endregion
}
</script>
