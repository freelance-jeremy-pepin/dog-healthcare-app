<template>
  <div>
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
        :value="professional.address |
              address(professional.city, professional.zipCode)"
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
  </div>
</template>

<script lang="ts">
import {
  Component,
  Mixins,
  Prop,
} from 'vue-property-decorator';
import { Professional } from 'src/models/professional';
import ItemIcon from 'components/common/ItemIcon.vue';
import TextFormatMixin from 'src/mixins/textFormatMixin';

@Component({
  components: { ItemIcon },
})
export default class ProfessionalIdentityDetails extends Mixins(TextFormatMixin) {
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
}
</script>

<style scoped>

</style>
