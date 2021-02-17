<template>
    <dialog-form
        v-if="activeDog"
        v-model="$attrs.value"
        v-bind="$attrs"
        v-on="$listeners"
        :is-editing="isEditing"
        :title="`${$options.filters.addOrEditLabel(isEditing)} un poids pour ${activeDog.name}`"
        @reset="reset"
        @submit="onSubmit"
    >
        <template v-if="internalWeight" v-slot:form>
            <q-input
                v-model="internalWeight.date"
                :rules="[required]"
                hide-bottom-space
                label="Date"
                outlined
            >
                <template v-slot:append>
                    <q-icon class="cursor-pointer" name="event">
                        <q-popup-proxy
                            ref="qDateProxy"
                            transition-hide="scale"
                            transition-show="scale"
                        >
                            <q-date
                                v-model="internalWeight.date"
                                :options="limitDatesNoFutur"
                                mask="DD/MM/YYYY"
                                today-btn
                                @input="() => $refs.qDateProxy.hide()"
                            />
                        </q-popup-proxy>
                    </q-icon>
                </template>
            </q-input>

            <q-input
                v-model="internalWeight.weight"
                :rules="[required,floatValidation]"
                hide-bottom-space
                label="Poids"
                outlined
            >
                <template v-slot:append>
                    kg
                </template>
            </q-input>
        </template>
    </dialog-form>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { createDefaultWeight, Weight } from 'src/models/weight';
import ActiveDogModule from 'src/store/modules/active-dog-module';
import { Dog } from 'src/models/dog';
import WeightRepository from 'src/repositories/weightRepository';
import ValidationMixin from 'src/mixins/validationMixin';
import DateMixin from 'src/mixins/dateMixin';
import DialogForm from 'components/common/DialogForm.vue';
import TextFormatMixin from 'src/mixins/textFormatMixin';

@Component({
    components: { DialogForm },
})
export default class DogWeightForm extends Mixins(ValidationMixin, DateMixin, TextFormatMixin) {
    // region Props

    @Prop({ required: false, default: undefined }) weight: Weight | undefined;

    // endregion

    // region Data

    private internalWeight: Weight | null = null;

    // endregion

    // region Computed properties

    private get isEditing(): boolean {
        return !!this.weight;
    }

    private get activeDog(): Dog | undefined {
        return ActiveDogModule.Dog;
    }

    // endregion

    // region Methods

    private reset() {
        if (this.weight) {
            this.internalWeight = { ...this.weight };
        } else {
            this.internalWeight = createDefaultWeight();
        }
    }

    private submitSuccessCallback() {
        ActiveDogModule.fetchWeights();

        this.$emit('input', false);
    }

    // endregion

    // region Events handlers

    private onSubmit() {
        if (this.internalWeight) {
            const weight: Weight = { ...this.internalWeight };

            if (this.isEditing) {
                this.updateDog(weight);
            } else {
                this.createDog(weight);
            }
        }
    }

    // endregion

    // region Methods

    private createDog(weight: Weight) {
        if (this.activeDog?.id) {
            weight.dogId = this.activeDog.id;

            new WeightRepository().create(weight)
                .then(() => {
                    this.submitSuccessCallback();
                });
        }
    }

    private updateDog(weight: Weight) {
        new WeightRepository().update(weight)
            .then(() => {
                this.submitSuccessCallback();
            });
    }

    // endregion
}
</script>
