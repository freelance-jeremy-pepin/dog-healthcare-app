<template>
    <q-select
        v-model="$attrs.value"
        v-bind="$attrs"
        v-on="$listeners"
        :error="professionals && professionals.length === 0"
        :loading="professionals === null"
        :options="professionals"
        behavior="menu"
        fill-input
        hide-bottom-space
        hide-selected
        input-debounce="0"
        label="Professionnel"
        option-label="name"
        option-value="id"
        outlined
        use-input
        @filter="filterFn"
    >
        <template v-slot:option="scope">
            <q-item
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
            >
                <q-item-section>
                    <q-item-label v-html="scope.opt.name" />
                    <q-item-label v-if="scope.opt.professionalTypeDetails" caption>
                        {{ scope.opt.professionalTypeDetails.displayLabel }}
                    </q-item-label>
                </q-item-section>
            </q-item>
        </template>
    </q-select>
</template>

<script lang="ts">
import {
    Component,
    Vue,
} from 'vue-property-decorator';
import { Professional } from 'src/models/professional';
import ProfessionalRepository, { ProfessionalRelations } from 'src/repositories/professionalRepository';

@Component
export default class ProfessionalSelect extends Vue {
    // region Data

    private allProfessionals: Professional[] | null = null;

    private professionals: Professional[] | null = null;

    // endregion

    // region Hooks

    public mounted() {
        new ProfessionalRepository().getAll(
            [ProfessionalRelations.professionalType],
        )
            .then((data) => {
                this.allProfessionals = data;
                this.$emit('get-all-success', this.allProfessionals);
            })
            .finally(() => {
                if (!this.allProfessionals) {
                    this.allProfessionals = [];
                }

                this.professionals = this.allProfessionals;
            });
    }

    // endregion

    // region Methods

    public filterFn(val: string, update: (fn: unknown) => void) {
        update(() => {
            const needle = val.toLowerCase();
            if (this.allProfessionals) {
                // eslint-disable-next-line max-len
                this.professionals = this.allProfessionals.filter((v: Professional) => v.name.toLowerCase().includes(needle));
            }
        });
    }

    // endregion
}
</script>
