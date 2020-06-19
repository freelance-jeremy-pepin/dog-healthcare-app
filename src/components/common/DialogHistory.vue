<template>
  <q-dialog
    v-bind="$attrs"
    v-model="$attrs.value"
    v-on="$listeners"
  >
    <slot></slot>
  </q-dialog>
</template>

<script lang="ts">
import {
  Component,
  Vue,
} from 'vue-property-decorator';

@Component
export default class DialogHistory extends Vue {

}
</script>

<style scoped>

</style>
