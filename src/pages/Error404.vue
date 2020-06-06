<template>
  <div class="fixed-center text-center">
    <p>
      <img
        alt="error"
        style="width:30vw;max-width:150px;"
        src="../assets/sad.svg"
      >
    </p>
    <p class="text-faded">
      Sorry, nothing here...<strong>(404)</strong>
    </p>
    <q-btn
      color="secondary"
      style="width:200px;"
      to="/"
      label="Go back"
    />
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
} from 'vue-property-decorator';

@Component
export default class Error404 extends Vue {

}
</script>
