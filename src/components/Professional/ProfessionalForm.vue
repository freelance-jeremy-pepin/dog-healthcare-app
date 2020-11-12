<template>
    <div class="column items-center q-pa-md">
        <q-card style="max-width: 500px; width: 100%;">
            <q-card-section v-if="page.state === 'ready'">
                <div class="text-center text-subtitle2 q-pb-sm">
                    <span v-if="professionalId">Edition d'un professionnel</span>
                    <span v-else>Nouveau professionnel</span>
                </div>
                <q-form
                    class="q-gutter-md"
                    @submit="onSubmit"
                >
                    <input-icon
                        v-model="internalProfessional.name"
                        :rules="[required]"
                        hide-bottom-space
                        icon="business"
                        label="Nom"
                        outlined
                    />

                    <q-select
                        v-model="internalProfessional.professionalType"
                        :error="professionalTypes && professionalTypes.length === 0"
                        :loading="professionalTypes === null"
                        :options="professionalTypes"
                        :rules="[required]"
                        hide-bottom-space
                        label="Type de professionnel"
                        option-label="displayLabel"
                        option-value="internalLabel"
                        outlined
                        v-on:input="internalProfessional.professionalTypeId = internalProfessional.professionalType.id"
                    />

                    <input-icon
                        v-model="internalProfessional.phoneNumber"
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
                        v-model="internalProfessional.mobileNumber"
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
                        v-model="internalProfessional.address"
                        icon="home"
                        label="Adresse"
                        outlined
                    />

                    <div class="row">
                        <q-input
                            v-model="internalProfessional.zipCode"
                            class="col-4 q-pr-md"
                            label="Code postal"
                            outlined
                        />

                        <input-icon
                            v-model="internalProfessional.city"
                            class="col-8"
                            icon="location_on"
                            label="Ville"
                            outlined
                        />
                    </div>

                    <input-icon
                        v-model="internalProfessional.email"
                        :rules="[emailValidation]"
                        hide-bottom-space
                        icon="alternate_email"
                        label="E-mail"
                        outlined
                        type="email"
                    />

                    <q-input v-model="internalProfessional.notes" label="Notes" outlined type="textarea" />

                    <q-page-sticky
                        v-if="page.state === 'ready'"
                        :offset="[18, 18]"
                        position="bottom-right"
                    >
                        <q-btn color="green" fab icon="done" type="submit" />
                    </q-page-sticky>
                </q-form>
            </q-card-section>

            <q-card-section v-if="page.state === 'loading'" class="text-center">
                <q-spinner
                    color="primary"
                    size="3em"
                />
            </q-card-section>

            <q-card-section v-if="page.state === 'error'" class="text-center">
                <span class="text-negative text-bold">{{ page.errorMessage }}</span>
            </q-card-section>
        </q-card>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { createDefaultProfessional, Professional } from 'src/models/professional';

import ValidationMixin from 'src/mixins/validationMixin';
import NotifyMixin from 'src/mixins/notifyMixin';

import InputIcon from 'components/common/InputIcon.vue';

import { ProfessionalType } from 'src/models/professionalType';

import ProfessionalTypeRepository from 'src/repositories/professionalTypeRepository';
import ProfessionalRepository, { ProfessionalRelations } from 'src/repositories/professionalRepository';

import { AxiosError } from 'axios';
import Page, { PageState } from 'src/utils/pageState';

interface Loadings {
    professional: boolean;
    professionalTypes: boolean;
}

@Component({
    components: { InputIcon },
})
export default class ProfessionalForm extends Mixins(ValidationMixin, NotifyMixin) {
    // region Props

    @Prop({ required: false, default: undefined }) professionalId: number | undefined;

    // endregion

    // region Data

    private page: Page<Loadings> = new Page<Loadings>({
        professional: true,
        professionalTypes: true,
    });

    private internalProfessional: Professional | null = null;

    private professionalTypes: ProfessionalType[] = [];

    // endregion

    // region Hooks

    private mounted() {
        this.page.state = PageState.loading;

        this.getProfessional();

        this.getProfessionalTypes();
    }

    // endregion

    // region Events handlers

    public onSubmit() {
        if (this.professionalId) {
            this.updateProfessional();
        } else {
            this.createProfessional();
        }
    }

    // endregion

    // region Methods

    private createProfessional() {
        if (this.internalProfessional) {
            new ProfessionalRepository().create(this.internalProfessional)
                .then(() => {
                    this.$router.push({ name: 'professionals' });
                });
        }
    }

    private updateProfessional() {
        if (this.internalProfessional) {
            new ProfessionalRepository().update(this.internalProfessional)
                .then(() => {
                    this.$router.push({ name: 'professionals' });
                });
        }
    }

    private getProfessional() {
        if (this.professionalId) {
            new ProfessionalRepository().getById(this.professionalId, [ProfessionalRelations.professionalType])
                .then((professional) => {
                    this.internalProfessional = professional;
                })
                .catch((e: AxiosError) => {
                    this.page.processError(e);
                })
                .finally(() => {
                    this.page.loadings = { ...this.page.loadings, professional: false };
                });
        } else {
            this.internalProfessional = createDefaultProfessional();
            this.page.loadings = { ...this.page.loadings, professional: false };
        }
    }

    private getProfessionalTypes() {
        new ProfessionalTypeRepository().getAll()
            .then((data) => {
                if (data.length === 0) {
                    throw new Error('Aucun type de professionnel disponible.');
                }

                this.professionalTypes = data;
            })
            .catch((e: AxiosError | Error) => {
                this.page.processError(e);
            })
            .finally(() => {
                if (!this.professionalTypes) {
                    this.professionalTypes = [];
                }

                this.page.loadings = { ...this.page.loadings, professionalTypes: false };
            });
    }

    // endregion
}
</script>
