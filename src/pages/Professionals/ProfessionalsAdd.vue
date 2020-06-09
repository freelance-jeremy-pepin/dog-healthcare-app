<template>
  <div class="column items-center q-pa-md">
    <q-card style="max-width: 500px; width: 100%;">
      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <input-icon
            icon="business"
            label="Nom"
            outlined
            v-model="newProfessional.name"
          ></input-icon>

          <q-select
            :error="professionalTypes && professionalTypes.length === 0"
            :loading="professionalTypes === null"
            :options="professionalTypes"
            hide-bottom-space
            label="Type de professionnel"
            option-label="displayLabel"
            option-value="internalLabel"
            outlined
            v-model="professionalTypeSelected"
          />

          <input-icon
            icon="phone"
            label="Téléphone"
            outlined
            v-model="newProfessional.phoneNumber"
          ></input-icon>

          <input-icon
            icon="phone_android"
            label="Mobile"
            outlined
            v-model="newProfessional.mobileNumber"
          ></input-icon>

          <input-icon
            icon="home"
            label="Adresse"
            outlined
            v-model="newProfessional.address"
          ></input-icon>

          <div class="row">
            <q-input
              class="col-4 q-pr-md"
              label="Code postal"
              outlined
              v-model="newProfessional.zipCode"
            ></q-input>

            <input-icon
              class="col-8"
              icon="location_on"
              label="Ville"
              outlined
              v-model="newProfessional.city"
            ></input-icon>
          </div>

          <input-icon
            icon="alternate_email"
            label="E-mail"
            outlined
            v-model="newProfessional.email"
          ></input-icon>

          <q-input label="Notes" outlined type="textarea" v-model="newProfessional.notes" />
        </q-form>
      </q-card-section>
    </q-card>

    <q-page-sticky :offset="[18, 18]" position="bottom-right">
      <q-btn @click="onSubmit" color="green" fab icon="done" />
    </q-page-sticky>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
} from 'vue-property-decorator';
import { Professional } from 'src/models/professional';
import InputIcon from 'components/common/InputIcon.vue';
import { ProfessionalType } from 'src/models/professionalType';
import ProfessionalTypeRepository from 'src/repositories/ProfessionalTypeRepository';
import ProfessionalRepository from 'src/repositories/ProfessionalRepository';

@Component({
  components: { InputIcon },
})
export default class ProfessionalAdd extends Vue {
  // *** Data ***
  private newProfessional: Professional = this.emptyProfessional();

  private professionalTypes: ProfessionalType[] | null = null;

  private professionalTypeSelected: ProfessionalType | null = null;

  // *** Hooks ***
  public mounted() {
    const professionalTypeRepository = new ProfessionalTypeRepository();
    professionalTypeRepository.getAll().then((data) => {
      this.professionalTypes = data;
    }).finally(() => {
      if (!this.professionalTypes) {
        this.professionalTypes = [];
      }
    });
  }

  // *** Events handlers ***
  public onSubmit() {
    if (this.professionalTypeSelected && this.professionalTypeSelected.id) {
      const professionalTypeRepository = new ProfessionalTypeRepository();
      this.newProfessional.professionalType = professionalTypeRepository.buildIri(
        this.professionalTypeSelected.id,
      );

      const professionalRepository = new ProfessionalRepository();
      professionalRepository.add(this.newProfessional).then((data) => {
        this.$q.notify({
          message: `Nouveau professionnel : ${data.name} ajouté.`,
          type: 'positive',
        });

        this.$router.push({ name: 'professionals' });
      });
    }
  }

  // *** Methods ***
  // eslint-disable-next-line class-methods-use-this
  public emptyProfessional(): Professional {
    return {
      address: undefined,
      city: undefined,
      email: undefined,
      mobileNumber: undefined,
      name: '',
      notes: undefined,
      phoneNumber: undefined,
      professionalType: '',
      zipCode: undefined,
    };
  }
}
</script>

<style scoped>

</style>
