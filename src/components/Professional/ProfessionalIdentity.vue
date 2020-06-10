<template>

  <q-expansion-item
    :label="professional.name"
    caption="5 unread emails"
    group="group"
    popup
  >

    <template v-slot:header>
      <q-menu context-menu touch-position>
        <q-list style="min-width: 100px">
          <q-item
            :to="{ name: 'professionals.edit', params: { professional_id: professional.id } }"
            clickable
            v-close-popup
          >
            <q-item-section>
              <q-item-label>Editer</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator></q-separator>

          <q-item @click="deleteProfessionals" clickable v-close-popup>
            <q-item-section>
              <q-item-label class="text-negative">Supprimer</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>

      <q-item-section avatar>
        <q-avatar class="text-white" color="purple">
          {{ professional.name[0].toUpperCase() }}
        </q-avatar>
      </q-item-section>

      <q-item-section>
        {{ professional.name }}
      </q-item-section>
    </template>

    <q-card>
      <q-separator></q-separator>
      <q-card-section>
        <q-list class="rounded-borders" dense v-if="!isEmpty">
          <item-icon
            :value="professional.phoneNumber | phoneNumber"
            icon="phone"
            title="Téléphone"
            v-if="professional.phoneNumber"
          ></item-icon>

          <item-icon
            :value="professional.mobileNumber | phoneNumber"
            icon="phone_android"
            title="Mobile"
            v-if="professional.mobileNumber"
          ></item-icon>

          <item-icon
            :value="professional.address | address(professional.city, professional.zipCode)"
            icon="home"
            title="Adresse"
            v-if="professional.address || professional.city || professional.zipCode"
          ></item-icon>

          <item-icon
            :value="professional.email"
            icon="alternate_email"
            title="E-mail"
            v-if="professional.email"
          ></item-icon>

          <item-icon
            :value="professional.notes"
            icon="note"
            title="Notes"
            v-if="professional.notes"
          ></item-icon>
        </q-list>

        <div v-else>
          Aucune information
        </div>
      </q-card-section>
    </q-card>

  </q-expansion-item>
</template>

<script lang="ts">
import {
  Component,
  Mixins,
  Prop,
} from 'vue-property-decorator';
import { Professional } from 'src/models/professional';
import ProfessionalRepository from 'src/repositories/ProfessionalRepository';
import ItemIcon from 'components/common/ItemIcon.vue';
import TextFormatMixin from 'src/mixins/textFormatMixin';

@Component({
  components: { ItemIcon },
})
export default class ProfessionalIdentity extends Mixins(TextFormatMixin) {
  // *** Props ***
  @Prop({ required: true }) professional: Professional | undefined;

  // *** Computed properties ***
  public get isEmpty(): boolean {
    return !this.professional?.phoneNumber
      && !this.professional?.mobileNumber
      && !this.professional?.address
      && !this.professional?.city
      && !this.professional?.zipCode
      && !this.professional?.email
      && !this.professional?.notes;
  }

  // *** Methods ***
  public deleteProfessionals() {
    if (this.professional) {
      const professionalRepository = new ProfessionalRepository();
      professionalRepository.delete(this.professional).then(() => {
        this.$emit('deleted');
      });
    }
  }
}
</script>

<style scoped>

</style>
