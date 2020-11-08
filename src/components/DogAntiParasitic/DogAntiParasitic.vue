<template>
    <div>
        <expandable-card v-if="antiParasitics" key-local-storage="DogAntiParasitic">
            <template v-slot:header-label>
                Anti-parasitaires
            </template>

            <template v-slot:header-sub-label>
                <span
                    v-if="reminder"
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
                <expandable-card-button
                    color="green"
                    icon="add"
                    @click.stop="formDisplay = true"
                />
            </template>

            <template v-slot:content>
                <dog-anti-parasitic-summary :anti-parasitics="antiParasitics" />
            </template>
        </expandable-card>

        <dialog-history v-model="historyDisplay">
            <dog-anti-parasitic-table :anti-parasitics="antiParasitics" />
        </dialog-history>

        <dog-anti-parasitic-form v-model="formDisplay"></dog-anti-parasitic-form>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Mixins,
    Prop,
} from 'vue-property-decorator';
import ExpandableCard from 'components/common/ExpandableCard/ExpandableCard.vue';
import ExpandableCardButton from 'components/common/ExpandableCard/ExpandableCardButton.vue';
import {
    Reminder,
    ReminderTableName,
} from 'src/models/reminder';
import ActiveDogModule from 'src/store/modules/active-dog-module';
import DateIntervalMixin from 'src/mixins/dateIntervalMixin';
import DialogHistory from 'components/common/DialogHistory.vue';
import { AntiParasitic } from 'src/models/antiParasitic';
import DogAntiParasiticSummary from 'components/DogAntiParasitic/DogAntiParasiticSummary.vue';
import DogAntiParasiticTable from 'components/DogAntiParasitic/DogAntiParasiticTable.vue';
import DogAntiParasiticForm from 'components/DogAntiParasitic/DogAntiParasiticForm.vue';

@Component({
    components: {
        DogAntiParasiticForm,
        DogAntiParasiticTable,
        DogAntiParasiticSummary,
        DialogHistory,
        ExpandableCardButton,
        ExpandableCard,
    },
})
export default class DogAntiParasitic extends Mixins(DateIntervalMixin) {
    // *** Props ***
    @Prop({ required: true }) antiParasitics: AntiParasitic[] | undefined;

    // *** Data ***
    private formDisplay = false;

    private historyDisplay = false;

    // *** Computed properties ***
    // eslint-disable-next-line class-methods-use-this
    public get reminder(): Reminder | undefined {
        return ActiveDogModule.Reminder(ReminderTableName.antiParasitic);
    }
}
</script>

<style scoped>

</style>
