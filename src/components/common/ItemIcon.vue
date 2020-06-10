<template>
  <q-item @click="copyValue" clickable v-ripple>
    <q-item-section avatar>
      <q-icon :name="icon" />
    </q-item-section>
    <q-item-section class="q-py-sm">
      <q-item-label class="text-weight-medium">{{ title }}</q-item-label>
      <q-item-label>{{ value }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import {
  Component,
  Mixins,
  Prop,
  Vue,
} from 'vue-property-decorator';
import VueClipboard from 'vue-clipboard2';
import NotifyMixin from 'src/mixins/notifyMixin';

@Component
export default class ItemIcon extends Mixins(NotifyMixin) {
  // *** Props ***
  @Prop({ required: true }) icon: string | undefined;

  @Prop({ required: true }) title: string | undefined;

  @Prop({ required: true }) value: string | undefined;

  public mounted() {
    Vue.use(VueClipboard);
  }

  // *** Methods ***
  public copyValue() {
    if (this.value) {
      this.$copyText(this.value);
      this.notifySuccess('Copié dans le presse-papier');
    }
  }
}
</script>

<style scoped>

</style>
