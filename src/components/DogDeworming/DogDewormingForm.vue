<template>
    <dialog-form
        v-if="activeDog"
        v-model="$attrs.value"
        v-bind="$attrs"
        v-on="$listeners"
        :is-editing="!!deworming"
        :title="`${$options.filters.addOrEditLabel(isEditing)} une prise de vermifuge pour ${activeDog.name}`"
        @reset="reset"
        @submit="onSubmit"
    >
        <template v-if="internalDeworming" v-slot:form>
            <q-input
                v-model="internalDeworming.date"
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
                                v-model="internalDeworming.date"
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
                v-model="internalDeworming.dewormingName"
                :rules="[required]"
                hide-bottom-space
                label="Nom du vermifuge"
                outlined
            />

            <div class="row items-center">
                <span>Administré par</span>
                <q-radio v-model="caredBy" label="moi" val="owner" />
                <q-radio
                    v-model="caredBy"
                    label="un professionnel"
                    val="professional"
                />
            </div>

            <professional-select
                v-if="caredBy === 'professional'"
                v-model="internalDeworming.caredByProfessional"
                :rules="[required]"
                v-on:input="internalDeworming.caredByProfessionalId = internalDeworming.caredByProfessional ? internalDeworming.caredByProfessional.id : undefined"
            />

            <q-input
                v-model="internalDeworming.notes"
                autogrow
                label="Notes"
                outlined
                type="textarea"
            />

            <q-toggle v-model="updateReminder" label="Mettre à jour la date de prochaine prise" />
        </template>
    </dialog-form>
</template>

<script lang="ts">
import {
    Component,
    Mixins,
    Prop,
    Watch,
} from 'vue-property-decorator';
import ActiveDogModule from 'src/store/modules/active-dog-module';
import { Dog } from 'src/models/dog';
import moment from 'moment';
import { createDefaultDeworming, Deworming } from 'src/models/deworming';
import Date from 'src/utils/date';
import DewormingRepository from 'src/repositories/dewormingRepository';
import ProfessionalSelect from 'components/Professional/ProfessionalSelect.vue';
import ValidationMixin from 'src/mixins/validationMixin';
import { Reminder, ReminderTableName } from 'src/models/reminder';
import DateMixin from 'src/mixins/dateMixin';
import DateTime from 'src/utils/dateTime';
import DialogForm from 'components/common/DialogForm.vue';
import TextFormatMixin from 'src/mixins/textFormatMixin';
import NotifyMixin from 'src/mixins/notifyMixin';

enum CaredBy {
    owner = 'owner',
    professional = 'professional'
}

@Component({
    components: { DialogForm, ProfessionalSelect },
})
export default class DogDewormingForm extends Mixins(ValidationMixin, DateMixin, TextFormatMixin, NotifyMixin) {
    // region Props

    @Prop({ required: false, default: undefined }) deworming: Deworming | undefined;

    // endregion

    // region Data

    private internalDeworming: Deworming | null = null;

    private caredBy: CaredBy | null = null;

    private updateReminder = true;

    // endregion

    // region Computed properties

    private get isEditing(): boolean {
        return !!this.deworming;
    }

    private get activeDog(): Dog | undefined {
        return ActiveDogModule.Dog;
    }

    // endregion

    // region Events handlers

    private onSubmit() {
        if (this.internalDeworming) {
            const deworming: Deworming = { ...this.internalDeworming };

            if (this.isEditing) {
                this.updateDeworming(deworming);
            } else {
                this.createDeworming(deworming);
            }
        }
    }

    // endregion

    // region Methods

    private reset() {
        this.updateReminder = true;

        if (this.deworming) {
            this.internalDeworming = {
                ...this.deworming,
                date: moment(this.deworming.date, DateTime.appFormat).format(Date.appFormat),
            };

            if (this.deworming.caredByProfessional) {
                this.caredBy = CaredBy.professional;
            } else if (this.deworming.caredByOwner) {
                this.caredBy = CaredBy.owner;
            }
        } else {
            this.internalDeworming = createDefaultDeworming();
        }
    }

    private submitSuccessCallback() {
        ActiveDogModule.fetchDewormings();

        if (this.updateReminder) {
            const reminder: Reminder | undefined = ActiveDogModule.Reminder(ReminderTableName.deworming);

            if (!reminder) {
                throw new Error(`Impossible de mettre à jour le prochain rappel car il n'existe aucun rappel pour ce chien.`);
            } else if (ActiveDogModule.Dog && this.internalDeworming) {
                new DewormingRepository().updateNextReminder(ActiveDogModule.Dog, { ...reminder })
                    .then(() => {
                        ActiveDogModule.fetchReminders();
                    })
                    .catch((e) => {
                        this.notifyErrorAxios(e);
                    });
            }
        }

        this.$emit('input', false);
    }

    private createDeworming(deworming: Deworming) {
        if (this.activeDog?.id) {
            deworming.dogId = this.activeDog.id;

            new DewormingRepository().create(deworming)
                .then(() => {
                    this.submitSuccessCallback();
                });
        }
    }

    private updateDeworming(deworming: Deworming) {
        new DewormingRepository().update(deworming)
            .then(() => {
                this.submitSuccessCallback();
            });
    }

    // endregion

    // region Watchers

    @Watch('caredBy', { immediate: true })
    private onCaredByChanged() {
        if (this.internalDeworming) {
            if (this.caredBy === CaredBy.owner) {
                this.internalDeworming.caredByOwner = true;
                this.internalDeworming.caredByProfessionalId = undefined;
                this.internalDeworming.caredByProfessional = undefined;
            } else if (this.caredBy === CaredBy.professional) {
                this.internalDeworming.caredByOwner = false;
            }
        }
    }

    // endregion
}
</script>
