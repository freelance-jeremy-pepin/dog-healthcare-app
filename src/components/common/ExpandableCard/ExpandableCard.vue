<template>
  <q-card bordered>
    <q-expansion-item
      expand-separator
      class="bg-white"
      expand-icon-class="q-pa-none"
      v-bind="$attrs"
      v-model="$attrs.value"
      v-on="$listeners"
      icon="signal_wifi_off"
      switch-toggle-side
    >
      <template v-slot:header>
        <q-item-section>
          <div class="row no-wrap items-center">
            <div class="col ellipsis">
              <span class="text-h6">
                <slot name="header-label"></slot>
              </span>

              <transition
                appear
                enter-active-class="animated fadeIn"
                leave-active-class="animated fadeOut"
              >
                <span
                  class="text-subtitle2 text-grey"
                  v-if="$slots['header-sub-label'] && !$attrs.value"
                >
                  •
                  <slot name="header-sub-label" />
              </span>
              </transition>
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
