<template>
  <q-card bordered>
    <q-expansion-item
      class="bg-white"
      expand-icon-class="q-pa-none"
      expand-icon-toggle
      v-bind="$attrs"
      v-model="$attrs.value"
      v-on="$listeners"
    >
      <template v-slot:header>
        <q-item-section>
          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">
              <slot name="header-label"></slot>
            </div>
          </div>
        </q-item-section>

        <q-item-section side top>
          <div class="q-gutter-xs">
            <slot name="header-buttons"></slot>
          </div>
        </q-item-section>
      </template>

      <q-card>
        <q-separator />
        <q-card-section>
          <slot name="content"></slot>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-card>
</template>

<script lang="ts">
import {
  Component,
  Vue,
} from 'vue-property-decorator';

@Component
export default class ExpandableCard extends Vue {
}
</script>

<style scoped>

</style>
