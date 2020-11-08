<template>
    <div class="column items-center q-pa-md">
        <q-card style="max-width: 500px; width: 100%;">
            <q-card-section v-if="pageState === 'ready'">
                <div class="text-center text-subtitle2 q-pb-sm">
                    <span v-if="oldName">Edition du professionnel : {{ oldName }}</span>
                    <span v-else>Nouveau professionnel</span>
                </div>
                <q-form
                    ref="form"
                    class="q-gutter-md"
                    @submit="onSubmit"
                    @keydown.enter="onSubmit"
                >
                    <input-icon
                        v-model="professional.name"
                        :rules="[required]"
                        hide-bottom-space
                        icon="business"
                        label="Nom"
                        outlined
                    />

                    <q-select
                        v-model="professionalTypeSelected"
                        :error="professionalTypes && professionalTypes.length === 0"
                        :loading="professionalTypes === null"
                        :options="professionalTypes"
                        :rules="[required]"
                        hide-bottom-space
                        label="Type de professionnel"
                        option-label="displayLabel"
                        option-value="internalLabel"
                        outlined
                    />

                    <input-icon
                        v-model="professional.phoneNumber"
                        :rules="[phoneNumberValidation]"
                        hide-bottom-space
                        icon="phone"
                        label="Téléphone"
                        mask="## ## ## ## ##"
                        outlined
                        type="tel"
                        unmasked-value
                    />

                    <input-icon
                        v-model="professional.mobileNumber"
                        :rules="[phoneNumberValidation]"
                        hide-bottom-space
                        icon="phone_android"
                        label="Mobile"
                        mask="## ## ## ## ##"
                        outlined
                        type="tel"
                        unmasked-value
                    />

                    <input-icon
                        v-model="professional.address"
                        icon="home"
                        label="Adresse"
                        outlined
                    />

                    <div class="row">
                        <q-input
                            v-model="professional.zipCode"
                            class="col-4 q-pr-md"
                            label="Code postal"
                            outlined
                        />

                        <input-icon
                            v-model="professional.city"
                            class="col-8"
                            icon="location_on"
                            label="Ville"
                            outlined
                        />
                    </div>

                    <input-icon
                        v-model="professional.email"
                        :rules="[emailValidation]"
                        hide-bottom-space
                        icon="alternate_email"
                        label="E-mail"
                        outlined
                        type="email"
                    />

                    <q-input v-model="professional.notes" label="Notes" outlined type="textarea" />
                </q-form>
            </q-card-section>

            <q-card-section v-if="pageState === 'loading'" class="text-center">
                <q-spinner
                    color="primary"
                    size="3em"
                />
            </q-card-section>

            <q-card-section v-if="pageState === 'unknown'" class="text-center">
                <span class="text-red text-bold">Professionnel introuvable</span>
            </q-card-section>

            <q-card-section v-if="pageState === 'error'" class="text-center">
                <span class="text-negative text-bold">Une erreur s'est produite</span>
            </q-card-section>
        </q-card>

        <q-page-sticky v-if="pageState === 'ready'" :offset="[18, 18]" position="bottom-right">
            <q-btn color="green" fab icon="done" @click="onSubmit" />
        </q-page-sticky>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Mixins,
    Prop,
} from 'vue-property-decorator';
import { Professional } from 'src/models/professional';
import InputIcon from 'components/common/InputIcon.vue';
import { ProfessionalType } from 'src/models/professionalType';
import ProfessionalTypeRepository from 'src/repositories/ProfessionalTypeRepository';
import ProfessionalRepository from 'src/repositories/ProfessionalRepository';
import ValidationMixin from 'src/mixins/validationMixin';
import { getIdFromIRI } from 'src/utils/stringFormat';
import { PageState } from 'src/const';
import NotifyMixin from 'src/mixins/notifyMixin';

@Component({
    components: { InputIcon },
})
export default class ProfessionalForm extends Mixins(ValidationMixin, NotifyMixin) {
    // *** Props ***
    @Prop({ required: false, default: undefined }) professionalId: number | undefined;

    // *** Data ***
    private pageState: PageState | null = null;

    private professional: Professional | null = null;

    private oldName: string | null = null;

    private professionalTypes: ProfessionalType[] | null = null;

    private professionalTypeSelected: ProfessionalType | null = null;

    // *** Hooks ***
    public mounted() {
        this.pageState = PageState.loading;

        if (this.professionalId) { // Modification
            const professionalRepository = new ProfessionalRepository();
            professionalRepository.getById(this.professionalId).then((data) => {
                if (data) {
                    this.professional = data;
                    this.oldName = data.name;
                    this.setProfessionalSelected();
                    this.pageState = PageState.ready;
                } else {
                    this.pageState = PageState.unknown;
                }
            }).catch(() => {
                this.pageState = PageState.error;
            });
        } else { // Ajout
            this.professional = this.emptyProfessional();
            this.pageState = PageState.ready;
        }

        const professionalTypeRepository = new ProfessionalTypeRepository();
        professionalTypeRepository.getAll().then((data) => {
            this.professionalTypes = data;
            this.setProfessionalSelected();
        }).finally(() => {
            if (!this.professionalTypes) {
                this.professionalTypes = [];
            }
        });
    }

    // *** Events handlers ***
    public onSubmit() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        this.$refs.form.validate().then((success: boolean) => {
            if (success
                && this.professional
                && this.professionalTypeSelected
                && this.professionalTypeSelected.id) {
                const professionalTypeRepository = new ProfessionalTypeRepository();
                this.professional.professionalType = professionalTypeRepository.buildIri(
                    this.professionalTypeSelected,
                );

                const professionalRepository = new ProfessionalRepository();
                if (this.professionalId) {
                    professionalRepository.update(this.professional).then((data) => {
                        this.notifySuccess(`Professionnel : ${data.name} modifié.`);
                        this.$router.push({ name: 'professionals' });
                    });
                } else {
                    professionalRepository.add(this.professional).then((data) => {
                        this.notifySuccess(`Nouveau professionnel : ${data.name} ajouté.`);
                        this.$router.push({ name: 'professionals' });
                    });
                }
            }
        });
    }

    // *** Methods ***
    // eslint-disable-next-line class-methods-use-this
    public emptyProfessional(): Professional {
        return {
            address: undefined,
            city: undefined,
            email: '',
            mobileNumber: '',
            name: '',
            notes: undefined,
            phoneNumber: '',
            professionalType: '',
            zipCode: undefined,
        };
    }

    public setProfessionalSelected() {
        if (this.professionalTypes && this.professional && this.professional.professionalType) {
            const professionalTypeIri = getIdFromIRI(this.professional.professionalType);
            const professionalType = this.professionalTypes.find(
                (pt) => pt.id === professionalTypeIri,
            );

            if (professionalType) {
                this.professionalTypeSelected = professionalType;
            }
        }
    }
}
</script>

<style scoped>

</style>
