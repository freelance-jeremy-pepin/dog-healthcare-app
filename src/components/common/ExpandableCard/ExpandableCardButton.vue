<template>
  <q-btn
    class="gt-xs"
    dense
    flat
    round
    size="12px"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script lang="ts">
import {
  Component,
  Vue,
} from 'vue-property-decorator';

@Component
export default class ExpandableCardButton extends Vue {
}
</script>

<style scoped>

</style>
