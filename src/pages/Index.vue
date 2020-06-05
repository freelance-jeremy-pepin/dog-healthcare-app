<template>
  <q-page class="row items-center justify-evenly">
    <q-btn @click='logout'>Logout</q-btn>
    <q-btn @click='request'>Request</q-btn>
  </q-page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { api } from 'src/api/appApi';
import Auth from 'src/api/auth';

@Component
export default class Index extends Vue {
  logout = () => {
    Auth.logout();
  }

  request = () => {
    api.get('api/dogs');
  }
}
</script>
