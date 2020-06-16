<template>
  <div class="column items-center q-pa-md">
    <q-card style="max-width: 500px; width: 100%;">
      <q-card-section v-if="pageState === 'ready'">
        <div class="text-center text-subtitle2 q-pb-sm">
          <span v-if="oldName">Edition du professionnel : {{ oldName }}</span>
          <span v-else>Nouveau professionnel</span>
        </div>
        <q-form
          @keydown.enter="onSubmit"
          @submit="onSubmit"
          class="q-gutter-md"
          ref="form"
        >
          <input-icon
            :rules="[required]"
            hide-bottom-space
            icon="business"
            label="Nom"
            outlined
            v-model="professional.name"
          />

          <q-select
            :error="professionalTypes && professionalTypes.length === 0"
            :loading="professionalTypes === null"
            :options="professionalTypes"
            :rules="[required]"
            hide-bottom-space
            label="Type de professionnel"
            option-label="displayLabel"
            option-value="internalLabel"
            outlined
            v-model="professionalTypeSelected"
          />

          <input-icon
            :rules="[phoneNumberValidation]"
            hide-bottom-space
            icon="phone"
            label="Téléphone"
            mask="## ## ## ## ##"
            outlined
            type="tel"
            unmasked-value
            v-model="professional.phoneNumber"
          />

          <input-icon
            :rules="[phoneNumberValidation]"
            hide-bottom-space
            icon="phone_android"
            label="Mobile"
            mask="## ## ## ## ##"
            outlined
            type="tel"
            unmasked-value
            v-model="professional.mobileNumber"
          />

          <input-icon
            icon="home"
            label="Adresse"
            outlined
            v-model="professional.address"
          />

          <div class="row">
            <q-input
              class="col-4 q-pr-md"
              label="Code postal"
              outlined
              v-model="professional.zipCode"
            />

            <input-icon
              class="col-8"
              icon="location_on"
              label="Ville"
              outlined
              v-model="professional.city"
            />
          </div>

          <input-icon
            :rules="[emailValidation]"
            hide-bottom-space
            icon="alternate_email"
            label="E-mail"
            outlined
            type="email"
            v-model="professional.email"
          />

          <q-input label="Notes" outlined type="textarea" v-model="professional.notes" />
        </q-form>
      </q-card-section>

      <q-card-section class="text-center" v-if="pageState === 'loading'">
        <q-spinner
          color="primary"
          size="3em"
        />
      </q-card-section>

      <q-card-section class="text-center" v-if="pageState === 'unknown'">
        <span class="text-red text-bold">Professionnel introuvable</span>
      </q-card-section>

      <q-card-section class="text-center" v-if="pageState === 'error'">
        <span class="text-negative text-bold">Une erreur s'est produite</span>
      </q-card-section>
    </q-card>

    <q-page-sticky :offset="[18, 18]" position="bottom-right" v-if="pageState === 'ready'">
      <q-btn @click="onSubmit" color="green" fab icon="done" />
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
