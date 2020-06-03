<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <login-form></login-form>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LoginForm from 'components/LoginForm.vue';

@Component({
  components: { LoginForm },
})
export default class Index extends Vue {

}
</script>
