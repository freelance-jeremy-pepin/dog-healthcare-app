<template>
  <q-page class="row items-center justify-evenly">
    <q-btn @click='logout'>Logout</q-btn>
  </q-page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { logout } from 'src/api/auth';

@Component
export default class Index extends Vue {
  logout = () => {
    logout();
  }
}
</script>
