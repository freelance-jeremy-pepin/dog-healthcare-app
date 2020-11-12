<template>
    <dialog-form
        v-if="activeDog"
        v-model="$attrs.value"
        v-bind="$attrs"
        v-on="$listeners"
        :is-editing="!!antiParasitic"
        :title="`${$options.filters.addOrEditLabel(isEditing)} une prise d'anti-parasitaire pour ${activeDog.name}`"
        @reset="reset"
        @submit="onSubmit"
    >
        <template v-if="internalAntiParasitic" v-slot:form>
            <q-input
                v-model="internalAntiParasitic.date"
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
                                v-model="internalAntiParasitic.date"
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
                v-model="internalAntiParasitic.antiParasiticName"
                :rules="[required]"
                hide-bottom-space
                label="Nom de l'anti-parasitaire"
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
                v-model="internalAntiParasitic.caredByProfessional"
                :rules="[required]"
                v-on:input="internalAntiParasitic.caredByProfessionalId = internalAntiParasitic.caredByProfessional ? internalAntiParasitic.caredByProfessional.id : undefined"
            />

            <q-input
                v-model="internalAntiParasitic.notes"
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
import Date from 'src/utils/date';
import ProfessionalSelect from 'components/Professional/ProfessionalSelect.vue';
import ValidationMixin from 'src/mixins/validationMixin';
import { Reminder, ReminderTableName } from 'src/models/reminder';
import DateMixin from 'src/mixins/dateMixin';
import DateTime from 'src/utils/dateTime';
import DialogForm from 'components/common/DialogForm.vue';
import { AntiParasitic, createDefaultAntiParasitic } from 'src/models/antiParasitic';
import AntiParasiticRepository from 'src/repositories/antiParasiticRepository';
import TextFormatMixin from 'src/mixins/textFormatMixin';
import NotifyMixin from 'src/mixins/notifyMixin';

enum CaredBy {
    owner = 'owner',
    professional = 'professional'
}

@Component({
    components: { DialogForm, ProfessionalSelect },
})
export default class DogAntiParasiticForm extends Mixins(ValidationMixin, DateMixin, TextFormatMixin, NotifyMixin) {
    // region Props

    @Prop({ required: false, default: undefined }) antiParasitic: AntiParasitic | undefined;

    // endregion

    // region Data

    private internalAntiParasitic: AntiParasitic | null = null;

    private caredBy: CaredBy | null = null;

    private updateReminder = true;

    // endregion

    // region Computed properties

    private get isEditing(): boolean {
        return !!this.antiParasitic;
    }

    private get activeDog(): Dog | undefined {
        return ActiveDogModule.Dog;
    }

    // endregion

    // region Events handlers

    private onSubmit() {
        if (this.internalAntiParasitic) {
            const antiParasitic: AntiParasitic = { ...this.internalAntiParasitic };

            if (this.isEditing) {
                this.updateAntiParasitic(antiParasitic);
            } else {
                this.createAntiParasitic(antiParasitic);
            }
        }
    }

    // endregion

    // region Methods

    private reset() {
        this.updateReminder = true;

        if (this.antiParasitic) {
            this.internalAntiParasitic = {
                ...this.antiParasitic,
                date: moment(this.antiParasitic.date, DateTime.appFormat).format(Date.appFormat),
            };

            if (this.antiParasitic.caredByProfessional) {
                this.caredBy = CaredBy.professional;
            } else if (this.antiParasitic.caredByOwner) {
                this.caredBy = CaredBy.owner;
            }
        } else {
            this.internalAntiParasitic = createDefaultAntiParasitic();
        }
    }

    private submitSuccessCallback() {
        ActiveDogModule.fetchAntiParasitics();

        if (this.updateReminder) {
            const reminder: Reminder | undefined = ActiveDogModule.Reminder(ReminderTableName.antiParasitic);

            if (!reminder) {
                throw new Error(`Impossible de mettre à jour le prochain rappel car il n'existe aucun rappel pour ce chien.`);
            } else if (ActiveDogModule.Dog && this.internalAntiParasitic) {
                new AntiParasiticRepository().updateNextReminder(ActiveDogModule.Dog, { ...reminder })
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

    private createAntiParasitic(antiParasitic: AntiParasitic) {
        if (this.activeDog?.id) {
            antiParasitic.dogId = this.activeDog.id;

            new AntiParasiticRepository().create(antiParasitic)
                .then(() => {
                    this.submitSuccessCallback();
                });
        }
    }

    private updateAntiParasitic(antiParasitic: AntiParasitic) {
        new AntiParasiticRepository().update(antiParasitic)
            .then(() => {
                this.submitSuccessCallback();
            });
    }

    // endregion

    // region Watchers

    @Watch('caredBy', { immediate: true })
    private onCaredByChanged() {
        if (this.internalAntiParasitic) {
            if (this.caredBy === CaredBy.owner) {
                this.internalAntiParasitic.caredByOwner = true;
                this.internalAntiParasitic.caredByProfessionalId = undefined;
                this.internalAntiParasitic.caredByProfessional = undefined;
            } else if (this.caredBy === CaredBy.professional) {
                this.internalAntiParasitic.caredByOwner = false;
            }
        }
    }

    // endregion
}
</script>
