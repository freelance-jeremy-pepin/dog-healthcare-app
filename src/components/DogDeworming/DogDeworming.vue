<template>
  <div>
    <expandable-card v-if="dewormings" v-model="expanded">
      <template v-slot:header-label>
        Vermifuges
        <span class="text-subtitle2 text-grey" v-if="!expanded">•
          <span :class="`text-${$options.filters.color(reminder.nextReminder)}`" v-if="reminder">
            {{ $options.filters.ago(reminder.nextReminder)}}
          </span>
          <span v-else>Non planifié</span>
        </span>
      </template>

      <template v-slot:header-buttons>
        <expandable-card-button @click.stop="historyDisplay = true" color="grey" icon="history" />
        <expandable-card-button @click.stop="formDisplay = true" color="green" icon="add" />
      </template>

      <template v-slot:content>
        <dog-deworming-summary :dewormings="dewormings" />
      </template>
    </expandable-card>

    <q-dialog v-model="historyDisplay">
      <dog-deworming-table :dewormings="dewormings" />
    </q-dialog>

    <dog-deworming-form v-model="formDisplay"></dog-deworming-form>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Mixins,
  Prop,
  Watch,
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

@Component({
  components: {
    ExpandableCardButton,
    ExpandableCard,
    DogDewormingForm,
    DogDewormingSummary,
    DogDewormingTable,
  },
})
export default class DogDeworming extends Mixins(DateIntervalMixin) {
  // *** Props ***
  @Prop({ required: true }) dewormings: Deworming[] | undefined;

  // *** Data ***
  private expanded = false;

  private formDisplay = false;

  private historyDisplay = false;

  // *** Hooks ***
  public mounted() {
    const expandedLocalStorage = localStorage.getItem('DogDeworming.expanded');
    if (expandedLocalStorage) {
      this.expanded = expandedLocalStorage === 'true';
    }
  }

  // *** Computed properties ***
  // eslint-disable-next-line class-methods-use-this
  public get reminder(): Reminder | undefined {
    return ActiveDogModule.Reminder(ReminderTableName.deworming);
  }

  // *** Watchers ***
  @Watch('expanded')
  // eslint-disable-next-line class-methods-use-this
  public onExpandedChanged(value: boolean) {
    localStorage.setItem('DogDeworming.expanded', value.toString());
  }
}
</script>

<style scoped>

</style>
