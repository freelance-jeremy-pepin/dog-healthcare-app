<template>
  <main-layout>
    <div class="bg-accent text-white">
      <q-toolbar>
        <q-breadcrumbs active-color="white" style="font-size: 16px">
          <template v-slot:separator>
            <q-icon
              name="chevron_right"
              size="1.5em"
            />
          </template>

          <q-breadcrumbs-el
            :to="{ name: 'professionals' }"
            icon="supervisor_account"
            label="Professionnels"
          />

          <q-breadcrumbs-el
            :to="{ name: 'professionals.add' }"
            label="Ajout d'un professionnel"
            v-if="currentRouteName === 'professionals.add'"
          />
        </q-breadcrumbs>
      </q-toolbar>
    </div>
  </main-layout>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Watch,
} from 'vue-property-decorator';
import MainLayout from 'layouts/MainLayout.vue';

@Component({
  components: {
    MainLayout,
  },
})
export default class ProfessionalLayout extends Vue {
  private currentRouteName: string | null | undefined = '';

  @Watch('$route', { immediate: true })
  public onRouteChange() {
    this.currentRouteName = this.$router.currentRoute.name;
  }
}
</script>

<style scoped>

</style>
