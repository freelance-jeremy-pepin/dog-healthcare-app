<!--suppress ALL -->
<template>
  <q-layout class="shadow-2 rounded-borders" view="hHh lpR fFf">
    <q-header>
      <q-toolbar>
        <q-btn @click="drawerLeft = !drawerLeft" dense flat icon="menu" round />
        <q-toolbar-title>
          Carnet de santé pour chiens
        </q-toolbar-title>
        <user-avatar></user-avatar>
      </q-toolbar>
    </q-header>

    <q-drawer
      :breakpoint="500"
      :width="250"
      bordered
      show-if-above
      v-model="drawerLeft"
    >
      <q-scroll-area class="fit">
        <q-list class="menu-list q-mr-md" padding>
          <q-item
            :key="route.routeName"
            :to="{ name: route.routeName }"
            class="q-mb-sm"
            clickable
            exact
            v-for="route in routes"
            v-ripple
            :exact="route.exact"
          >
            <q-item-section avatar>
              <q-icon :name="route.icon" />
            </q-item-section>

            <q-item-section>
              {{route.label}}
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <slot></slot>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang='ts'>
import {
  Component,
  Vue,
} from 'vue-property-decorator';
import Auth from 'src/api/auth';
import UserAvatar from 'components/UserAvatar.vue';

interface Route {
  icon: string;
  label: string;
  routeName: string;
  exact: boolean;
}

@Component({
  components: {
    UserAvatar,
  },
})
export default class MainLayout extends Vue {
  // *** Data ***
  private drawerLeft = false;

  private routes: Route[] = [
    {
      icon: 'pets',
      label: 'Carnet de santé',
      routeName: 'home',
      exact: true,
    },
    {
      icon: 'supervisor_account',
      label: 'Professionels',
      routeName: 'professionals',
      exact: false
    },
  ];

  // *** Hooks ***
  public mounted() {
    window.addEventListener('storage', Auth.syncLogout);
    document.title = 'Carnet de santé pour chiens';
  }
}
</script>

<style scoped>
  .menu-list .q-item {
    border-radius: 0 32px 32px 0;
  }

  .q-router-link--active {
    background-color: #e6f1fc;
  }
</style>
