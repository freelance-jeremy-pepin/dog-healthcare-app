<template>
  <div class="column items-center q-pa-md" style="padding-bottom: 70px;">
    <div
      :key="professionalType.id"
      class="q-pb-md full-width"
      style="max-width: 500px"
      v-for="professionalType in professionalTypes"
    >
      <q-card v-if="professionalType.professionals && professionalType.professionals.length > 0">
        <q-card-section class="q-px-xs">
          <div class="text-subtitle2 q-px-md">
            {{ professionalType.displayLabel }}s
          </div>
          <q-list class="full-width">
            <professional-identity
              :key="professional.id"
              :professional="professional"
              @deleted="refreshList"
              class="full-width"
              v-for="professional in professionalType.professionals"
            ></professional-identity>
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
import ProfessionalIdentity from 'components/Professional/ProfessionalIdentity.vue';
import { Professional } from 'src/models/professional';
import { ProfessionalType } from 'src/models/professionalType';
import ProfessionalTypeRepository from 'src/repositories/ProfessionalTypeRepository';
import orderBy from 'lodash/orderBy';

@Component({
  components: { ProfessionalIdentity },
})
export default class Professionals extends Vue {
  // *** Data ***
  private professionalTypes: ProfessionalType[] | null = null;

  // *** Hooks ***
  public mounted() {
    this.refreshList();
  }

  // *** Methods ***
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
    const professionalTypeRepository = new ProfessionalTypeRepository();
    professionalTypeRepository.getAll(true).then((data) => {
      data.forEach((d) => {
        d.professionals = orderBy(d.professionals, [
          (professional: Professional) => professional.name.toLowerCase(),
        ]);
      });
      this.professionalTypes = data;
    });
  }
}
</script>

<style scoped>

</style>
