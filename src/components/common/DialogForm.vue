<template>
  <q-dialog
    @before-show="$emit('reset')"
    no-refocus
    position="bottom"
    ref="modal"
    v-bind="$attrs"
    v-model="$attrs.value"
    v-on="$listeners"
  >
    <q-card>
      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">
          {{ titleFormatted }}
        </div>
        <q-form
          @submit="$emit('submit')"
          class="column q-gutter-md"
        >
          <slot name="form"></slot>

          <q-btn :label="labelAction" color="positive" type="submit" />
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
} from 'vue-property-decorator';
import { Dog } from 'src/models/dog';
import ActiveDogModule from 'src/store/modules/active-dog-module';

@Component
export default class DialogForm extends Vue {
  @Prop({ required: true }) title: string | undefined;

  @Prop({ required: true }) isEditing: boolean | undefined;

  // *** Computed properties ***
  // eslint-disable-next-line class-methods-use-this
  public get activeDog(): Dog | undefined {
    return ActiveDogModule.Dog;
  }

  public get titleFormatted(): string {
    if (this.title) {
      let titleFormatted = this.title;

      titleFormatted = titleFormatted.replace('%labelAction%', this.labelAction);

      if (this.activeDog) {
        titleFormatted = titleFormatted.replace('%activeDog.name%', this.activeDog.name);
      }

      return titleFormatted;
    }

    return '';
  }

  public get labelAction(): string {
    return this.isEditing ? 'Modifier' : 'Ajouter';
  }

  // *** Methods ***
  public hide() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    this.$refs.modal.hide();
  }
}
</script>

<style scoped>

</style>
