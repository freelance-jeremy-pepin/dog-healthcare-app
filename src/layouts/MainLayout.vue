<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Carnet de santé pour chiens
        </q-toolbar-title>

        <user-avatar></user-avatar>
      </q-toolbar>
    </q-header>

    <q-page-container>
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

@Component({
  components: {
    UserAvatar,
  },
})
export default class MainLayout extends Vue {
  public mounted() {
    window.addEventListener('storage', Auth.syncLogout);
    document.title = 'Carnet de santé pour chiens';
  }
}
</script>
