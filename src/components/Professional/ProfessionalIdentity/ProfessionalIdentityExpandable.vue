<template>
    <q-expansion-item
        v-if="localProfessional"
        group="group"
        popup
    >
        <template v-slot:header>
            <q-menu context-menu touch-position>
                <q-list style="min-width: 100px">
                    <q-item
                        v-close-popup
                        :to="{ name: 'professionals.edit', params: { professional_id: localProfessional.id } }"
                        clickable
                    >
                        <q-item-section>
                            <q-item-label>Editer</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-separator></q-separator>

                    <q-item v-close-popup clickable @click="deleteProfessionals">
                        <q-item-section>
                            <q-item-label class="text-negative">Supprimer</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-menu>

            <professional-identity-avatar :professional="localProfessional" />
            <professional-identity-name :professional="localProfessional" />
        </template>

        <q-card>
            <q-separator />
            <q-card-section>
                <professional-identity-details :professional="localProfessional" />
            </q-card-section>
        </q-card>
    </q-expansion-item>
</template>

<script lang="ts">
import {
    Component,
    Prop,
    Vue,
} from 'vue-property-decorator';
import { Professional } from 'src/models/professional';
import ProfessionalRepository from 'src/repositories/ProfessionalRepository';
import ItemIcon from 'components/common/ItemIcon.vue';
import ProfessionalIdentityDetails
    from 'components/Professional/ProfessionalIdentity/ProfessionalIdentityDetails.vue';
import ProfessionalIdentityAvatar
    from 'components/Professional/ProfessionalIdentity/ProfessionalIdentityAvatar.vue';
import ProfessionalIdentityName
    from 'components/Professional/ProfessionalIdentity/ProfessionalIdentityName.vue';

@Component({
    components: {
        ProfessionalIdentityName,
        ProfessionalIdentityAvatar,
        ProfessionalIdentityDetails,
        ItemIcon,
    },
})
export default class ProfessionalIdentityExpandable extends Vue {
    // *** Props ***
    @Prop({ required: false }) professional: Professional | undefined;

    @Prop({ required: false }) professionalId: number | undefined;

    // *** Data ***
    private localProfessional: Professional | null = null;

    // *** Hooks ***
    public mounted() {
        if (!this.professional && this.professionalId) {
            const professionalRepository = new ProfessionalRepository();
            professionalRepository.getById(this.professionalId).then((professional: Professional) => {
                this.localProfessional = professional;
            });
        } else if (this.professional) {
            this.localProfessional = { ...this.professional };
        }
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
