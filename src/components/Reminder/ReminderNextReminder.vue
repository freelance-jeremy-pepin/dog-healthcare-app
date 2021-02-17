<template>
    <q-popup-proxy @hide="onSubmit" @before-show="reset">
        <q-date
            v-if="internalReminder"
            v-model="internalReminder.nextReminder"
            bordered
            flat
            mask="DD/MM/YYYY"
            today-btn
        />
    </q-popup-proxy>
</template>

<script lang="ts">
import {
    Component,
    Mixins,
    Prop,
    Watch,
} from 'vue-property-decorator';
import ValidationMixin from 'src/mixins/validationMixin';
import { Reminder } from 'src/models/reminder';
import DateMixin from 'src/mixins/dateMixin';
import ReminderRepository from 'src/repositories/reminderRepository';
import ActiveDogModule from 'src/store/modules/active-dog-module';

@Component
export default class ReminderNextReminder extends Mixins(ValidationMixin, DateMixin) {
    // region Props

    @Prop({ required: true }) reminder: Reminder | undefined;

    // endregion

    // region Data

    private internalReminder: Reminder | null = null;

    // endregion

    // region Methods

    public reset() {
        if (this.reminder) {
            this.internalReminder = { ...this.reminder };
        }
    }

    // endregion

    // region Events handlers

    public onSubmit() {
        if (this.internalReminder) {
            const reminder: Reminder = { ...this.internalReminder };

            new ReminderRepository().update(reminder)
                .then(() => {
                    ActiveDogModule.fetchReminders();
                });
        }
    }

    // endregion

    // region Watchers

    @Watch('reminder', { immediate: true, deep: true })
    public onReminderChanged() {
        this.reset();
    }

    // endregion
}
</script>
