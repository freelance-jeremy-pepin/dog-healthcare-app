<template>
    <div v-if="lastWeight" class="text-center">
        <div class="text-h4">
            {{ lastWeight.weight }} kg
        </div>

        <div class="text-subtitle2 text-grey">
            ({{ lastWeight.date | ago }})
        </div>
    </div>

    <div v-else class="text-center text-h4">
        Aucun poids
    </div>
</template>

<script lang="ts">
import {
    Component,
    Mixins,
} from 'vue-property-decorator';
import { Weight } from 'src/models/weight';
import ActiveDogModule from 'src/store/modules/active-dog-module';
import DateIntervalMixin from 'src/mixins/dateIntervalMixin';

@Component
export default class DogWeightSummary extends Mixins(DateIntervalMixin) {
    // region Computed properties

    public get lastWeight(): Weight | undefined {
        return ActiveDogModule.LastWeight;
    }

    // endregion
}
</script>
