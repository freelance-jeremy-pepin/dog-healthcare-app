<template>
  <q-form>
    <q-input label='email' type='email' v-model='email'></q-input>
    <q-input label='password' type='password' v-model='password'></q-input>
  </q-form>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class LoginForm extends Vue {
  private email = '';

  private password = '';
}
</script>

<style scoped>

</style>
