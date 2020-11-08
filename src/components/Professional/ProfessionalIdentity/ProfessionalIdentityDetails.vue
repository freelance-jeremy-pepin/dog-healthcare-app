<template>
    <div>
        <q-list v-if="!isEmpty" class="rounded-borders" dense>
            <item-icon
                v-if="professional.phoneNumber"
                :value="professional.phoneNumber | phoneNumber"
                icon="phone"
                title="Téléphone"
            ></item-icon>

            <item-icon
                v-if="professional.mobileNumber"
                :value="professional.mobileNumber | phoneNumber"
                icon="phone_android"
                title="Mobile"
            ></item-icon>

            <item-icon
                v-if="professional.address || professional.city || professional.zipCode"
                :value="professional.address |
              address(professional.city, professional.zipCode)"
                icon="home"
                title="Adresse"
            ></item-icon>

            <item-icon
                v-if="professional.email"
                :value="professional.email"
                icon="alternate_email"
                title="E-mail"
            ></item-icon>

            <item-icon
                v-if="professional.notes"
                :value="professional.notes"
                icon="note"
                title="Notes"
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
