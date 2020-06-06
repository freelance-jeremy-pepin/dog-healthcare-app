<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          @click="drawerLeft = !drawerLeft"
          dense
          flat
          icon="menu"
          round
          v-if="$q.screen.lt.sm"
        />
        <q-toolbar-title>
          Carnet de santé pour chien
        </q-toolbar-title>

        <q-btn @click="logout" flat label="Se déconnecter" v-if="!$q.screen.lt.sm"></q-btn>

        <q-btn flat round>
          <q-avatar color="orange" size="md">J</q-avatar>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      :breakpoint="500"
      :width="200"
      behavior="mobile"
      bordered
      content-class="bg-grey-3"
      show-if-above
      v-if="$q.screen.lt.sm"
      v-model="drawerLeft"
    >
      <q-scroll-area class="fit">
        <q-list>
          <q-item @click="logout" clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="power_settings_new" />
            </q-item-section>
            <q-item-section>
              Se déconnecter
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import Auth from 'src/api/auth';

@Component
export default class MainLayout extends Vue {
  private drawerLeft = false;

  public mounted() {
    window.addEventListener('storage', Auth.syncLogout);
    document.title = 'Carnet de santé pour chiens';
  }

  logout = () => {
    Auth.logout();
  }
}
</script>
