<template>
    <div>
        <q-card
            v-if="!localProfessional"
            style="width: 200px; height: 150px"
        >
            <div class="row full-height justify-center items-center">
                <q-spinner
                    color="primary"
                    size="3em"
                />
            </div>

        </q-card>

        <q-card v-if="localProfessional">
            <q-card-section>
                <q-item class="q-pa-none">
                    <professional-identity-avatar :professional="localProfessional" />
                    <professional-identity-name
                        :professional="localProfessional"
                        class="text-bold text-h6"
                    />
                </q-item>
            </q-card-section>

            <q-separator></q-separator>
            <q-card-section>
                <professional-identity-details :professional="localProfessional" />
            </q-card-section>
        </q-card>
    </div>

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
export default class ProfessionalIdentityCard extends Vue {
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
}
</script>

<style scoped>

</style>
