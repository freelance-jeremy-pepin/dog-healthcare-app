<template>
  <div>
    <q-page-sticky :offset="[18, 18]" position="bottom-right">
      <q-btn :to="{ name: 'professionals.add' }" color="green" fab icon="add" />
    </q-page-sticky>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
} from 'vue-property-decorator';

@Component
export default class Professionals extends Vue {

}
</script>

<style scoped>

</style>
