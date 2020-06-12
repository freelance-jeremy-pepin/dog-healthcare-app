<template>
  <q-select
    :error="professionals && professionals.length === 0"
    :loading="professionals === null"
    :options="professionals"
    @filter="filterFn"
    behavior="menu"
    fill-input
    hide-bottom-space
    hide-selected
    input-debounce="0"
    label="Professionnels"
    option-label="name"
    option-value="id"
    outlined
    use-input
    v-bind="$attrs"
    v-model="$attrs.value"
    v-on="$listeners"
  >
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        v-on="scope.itemEvents"
      >
        <q-item-section>
          <q-item-label v-html="scope.opt.name" />
          <q-item-label caption v-if="scope.opt.professionalTypeDetails">
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
import ProfessionalRepository from 'src/repositories/ProfessionalRepository';

@Component
export default class ProfessionalSelect extends Vue {
  // *** Data ***
  private allProfessionals: Professional[] | null = null;

  private professionals: Professional[] | null = null;

  // *** Hooks ***
  public mounted() {
    const professionalRepository = new ProfessionalRepository();
    professionalRepository.getAll(true).then((data) => {
      this.allProfessionals = data;
    }).finally(() => {
      if (!this.allProfessionals) {
        this.allProfessionals = [];
      }

      this.professionals = this.allProfessionals;
    });
  }

  // *** Methods ***
  public filterFn(val: string, update: (fn: unknown) => void) {
    update(() => {
      const needle = val.toLowerCase();
      if (this.allProfessionals) {
        // eslint-disable-next-line max-len
        this.professionals = this.allProfessionals.filter((v: Professional) => v.name.toLowerCase().includes(needle));
      }
    });
  }
}
</script>

<style scoped>

</style>
