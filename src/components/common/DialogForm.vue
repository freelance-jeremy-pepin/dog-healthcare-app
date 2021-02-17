<template>
    <q-dialog
        ref="modal"
        v-model="$attrs.value"
        v-bind="$attrs"
        v-on="$listeners"
        no-refocus
        @before-show="$emit('reset')"
    >
        <q-card>
            <q-card-section class="row">
                <div class="text-h6 wrap">{{ title }}</div>
            </q-card-section>

            <q-separator></q-separator>

            <q-form @submit="$emit('submit')">
                <q-card-section class="q-gutter-md">
                    <slot name="form"></slot>
                </q-card-section>

                <q-separator></q-separator>

                <q-card-actions align="right">
                    <q-btn v-close-popup color="grey" flat label="Fermer" />
                    <q-btn :label="labelAction" color="positive" flat type="submit" />
                </q-card-actions>
            </q-form>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class DialogForm extends Vue {
    // region Props

    @Prop({ required: true }) title: string | undefined;

    @Prop({ required: true }) isEditing: boolean | undefined;

    // endregion

    // region Computed properties

    public get labelAction(): string {
        return this.isEditing ? 'Modifier' : 'Ajouter';
    }

    // endregion

    // region Methods
    public hide() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        this.$refs.modal.hide();
    }

    // endregion
}
</script>
