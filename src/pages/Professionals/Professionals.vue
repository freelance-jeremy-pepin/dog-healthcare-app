<template>
    <div class="column items-center q-pa-md" style="padding-bottom: 70px;">
        <div
            v-for="professionalType in professionalTypes"
            :key="professionalType.id"
            class="q-pb-md full-width"
            style="max-width: 500px"
        >
            <q-card
                v-if="professionalType.professionals && professionalType.professionals.length > 0"
            >
                <q-card-section class="q-px-xs">
                    <div class="text-subtitle2 q-px-md">
                        {{ professionalType.displayLabel }}s
                    </div>
                    <q-list class="full-width">
                        <professional-identity-expandable
                            v-for="professional in professionalType.professionals"
                            :key="professional.id"
                            :professional="professional"
                            class="full-width"
                            @deleted="refreshList"
                        />
                    </q-list>
                </q-card-section>
            </q-card>
        </div>

        <q-page-sticky :offset="[18, 18]" position="bottom-right">
            <q-btn :to="{ name: 'professionals.add' }" color="green" fab icon="add" />
        </q-page-sticky>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Vue,
} from 'vue-property-decorator';
import ProfessionalIdentityExpandable
    from 'components/Professional/ProfessionalIdentity/ProfessionalIdentityExpandable.vue';
import { Professional } from 'src/models/professional';
import { ProfessionalType } from 'src/models/professionalType';
import ProfessionalTypeRepository, { ProfessionalTypeRelations } from 'src/repositories/professionalTypeRepository';
import orderBy from 'lodash/orderBy';

@Component({
    components: { ProfessionalIdentityExpandable },
})
export default class Professionals extends Vue {
    // region Data

    private professionalTypes: ProfessionalType[] | null = null;

    // endregion

    // region Hooks

    public mounted() {
        this.refreshList();
    }

    // endregion

    // region Methods

    public compare = (a: Professional, b: Professional) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    };

    public refreshList() {
        new ProfessionalTypeRepository()
            .getAll([ProfessionalTypeRelations.professionals])
            .then((data) => {
                data.forEach((d) => {
                    d.professionals = orderBy(d.professionals, [
                        (professional: Professional) => professional.name.toLowerCase(),
                    ]);
                });
                this.professionalTypes = data;
            });
    }

    // endregion
}
</script>
