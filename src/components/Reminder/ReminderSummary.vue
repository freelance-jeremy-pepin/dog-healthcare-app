<template>
    <div>
        <item-icon
            :title="labelLastDate"
            :value="lastDate ? `${$options.filters.toDate(lastDate)} (${$options.filters.ago(lastDate)})`
      : 'Jamais'"
            icon="history"
        />

        <item-icon
            v-if="reminder && reminder.nextReminder"
            :color="reminder.nextReminder | color"
            :title="labelNextReminder"
            :value="reminder ? `${reminder.nextReminder} (${$options.filters.ago(reminder.nextReminder)})`
       : 'Non planifié'"
            clickable
            icon="schedule"
        >
            <reminder-next-reminder :reminder="reminder" />
        </item-icon>

        <item-icon
            v-if="reminder"
            :title="this.$options.filters.formatPeriodicity(
        reminder.numberTimeInterval,
        reminder.timeIntervalDetails)"
            clickable
            icon="notifications"
        >
            <reminder-time-interval-form
                :last-date="lastDate ? lastDate : null"
                :reminder="reminder"
            />
        </item-icon>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Mixins,
    Prop,
} from 'vue-property-decorator';
import { Reminder } from 'src/models/reminder';
import DateIntervalMixin from 'src/mixins/dateIntervalMixin';
import DateTimeMixin from 'src/mixins/dateTimeMixin';
import ItemIcon from 'components/common/ItemIcon.vue';
import ReminderNextReminder from 'components/Reminder/ReminderNextReminder.vue';
import ReminderTimeIntervalForm from 'components/Reminder/ReminderTimeIntervalForm.vue';

@Component({
    components: { ReminderTimeIntervalForm, ReminderNextReminder, ItemIcon },
})
export default class ReminderSummary extends Mixins(DateTimeMixin, DateIntervalMixin) {
    @Prop({ required: true }) lastDate: string | undefined;

    @Prop({ required: true }) labelLastDate: string | undefined;

    @Prop({ required: true }) reminder: Reminder | undefined;

    @Prop({ required: true }) labelNextReminder: string | undefined;
}
</script>

<style scoped>

</style>
