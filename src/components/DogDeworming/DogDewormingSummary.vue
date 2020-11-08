<template>
    <reminder-summary
        :last-date="lastDeworming ? lastDeworming.date : null"
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
import { Deworming } from 'src/models/deworming';
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

@Component({
    components: {
        ReminderSummary, ReminderNextReminder, ReminderTimeIntervalForm, ItemIcon,
    },
})
export default class DogDewormingSummary extends Mixins(DateTimeMixin, DateIntervalMixin) {
    // *** Props ***
    @Prop({ required: true }) dewormings: Deworming[] | undefined;

    // *** Computed properties ***
    // eslint-disable-next-line class-methods-use-this
    public get reminder(): Reminder | undefined {
        return ActiveDogModule.Reminder(ReminderTableName.deworming);
    }

    // eslint-disable-next-line class-methods-use-this
    public get lastDeworming(): Deworming | null {
        return ActiveDogModule.LastDeworming;
    }
}
</script>

<style scoped>

</style>
