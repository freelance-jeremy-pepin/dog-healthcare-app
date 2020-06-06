<template>
  <q-page class="row items-center justify-evenly">
    <q-btn @click="request">Request</q-btn>
  </q-page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { api } from 'src/api/appApi';

@Component
export default class Index extends Vue {
  request = () => {
    api.get('api/dogs');
  }
}
</script>
