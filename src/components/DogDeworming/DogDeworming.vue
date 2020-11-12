<template>
    <div>
        <expandable-card v-if="dewormings" key-local-storage="DogDeworming">
            <template v-slot:header-label>
                Vermifuges
            </template>

            <template v-slot:header-sub-label>
                <span
                    v-if="reminder && reminder.nextReminder"
                    :class="`text-${$options.filters.color(reminder.nextReminder)}`"
                >
                    {{ $options.filters.ago(reminder.nextReminder) }}
                </span>
                <span v-else>Non planifié</span>
            </template>

            <template v-slot:header-buttons>
                <expandable-card-button
                    color="grey"
                    icon="history"
                    @click.stop="historyDisplay = true"
                />
                <expandable-card-button color="green" icon="add" @click.stop="formDisplay = true" />
            </template>

            <template v-slot:content>
                <dog-deworming-summary :dewormings="dewormings" />
            </template>
        </expandable-card>

        <dialog-history v-model="historyDisplay">
            <dog-deworming-table :dewormings="dewormings" />
        </dialog-history>

        <dog-deworming-form v-model="formDisplay"></dog-deworming-form>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Mixins,
    Prop,
} from 'vue-property-decorator';
import { Deworming } from 'src/models/deworming';
import DogDewormingTable from 'components/DogDeworming/DogDewormingTable.vue';
import DogDewormingSummary from 'components/DogDeworming/DogDewormingSummary.vue';
import DogDewormingForm from 'components/DogDeworming/DogDewormingForm.vue';
import ExpandableCard from 'components/common/ExpandableCard/ExpandableCard.vue';
import ExpandableCardButton from 'components/common/ExpandableCard/ExpandableCardButton.vue';
import {
    Reminder,
    ReminderTableName,
} from 'src/models/reminder';
import ActiveDogModule from 'src/store/modules/active-dog-module';
import DateIntervalMixin from 'src/mixins/dateIntervalMixin';
import DialogHistory from 'components/common/DialogHistory.vue';

@Component({
    components: {
        DialogHistory,
        ExpandableCardButton,
        ExpandableCard,
        DogDewormingForm,
        DogDewormingSummary,
        DogDewormingTable,
    },
})
export default class DogDeworming extends Mixins(DateIntervalMixin) {
    // region Props

    @Prop({ required: true }) dewormings: Deworming[] | undefined;

    // endregion

    // region Data

    private formDisplay = false;

    private historyDisplay = false;

    // endregion

    // region Computed properties

    public get reminder(): Reminder | undefined {
        return ActiveDogModule.Reminder(ReminderTableName.deworming);
    }

    // endregion
}
</script>
