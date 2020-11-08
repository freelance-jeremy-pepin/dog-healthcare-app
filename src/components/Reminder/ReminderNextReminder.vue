<template>
    <q-popup-proxy @hide="onSubmit" @before-show="reset">
        <q-date
            v-if="reminderEditing"
            v-model="reminderEditing.nextReminder"
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
import ReminderRepository from 'src/repositories/ReminderRepository';
import ActiveDogModule from 'src/store/modules/active-dog-module';

@Component
export default class ReminderNextReminder extends Mixins(ValidationMixin, DateMixin) {
    // *** Props ***
    @Prop({ required: true }) reminder: Reminder | undefined;

    // *** Data ***
    private reminderEditing: Reminder | null = null;

    // *** Methods ***
    public reset() {
        if (this.reminder) {
            this.reminderEditing = { ...this.reminder };
        }
    }

    // *** Events handlers ***
    public onSubmit() {
        if (this.reminderEditing) {
            const reminder: Reminder = { ...this.reminderEditing };

            const reminderRepository = new ReminderRepository();
            reminderRepository.update(reminder).then(() => {
                ActiveDogModule.fetchReminders();
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
