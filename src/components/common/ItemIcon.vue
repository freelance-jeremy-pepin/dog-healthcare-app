<template>
    <q-item
        :clickable="copyValue !== false || clickable !== false"
        :v-ripple="copyValue !== false || clickable !== false"
        @click="copy"
    >
        <slot></slot>
        <q-item-section avatar>
            <q-icon :color="color" :name="icon" />
        </q-item-section>
        <q-item-section class="q-py-sm">
            <q-item-label :class="getTextColor('text-weight-medium')">{{ title }}
            </q-item-label>
            <q-item-label v-if="value" :class="getTextColor()">{{ value }}</q-item-label>
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
    // region Props

    @Prop({ required: true }) icon: string | undefined;

    @Prop({ required: true }) title: string | undefined;

    @Prop({ required: false }) value: string | undefined;

    @Prop({ required: false }) color: string | undefined;

    @Prop({ required: false, default: false }) copyValue: boolean | undefined;

    @Prop({ required: false, default: false }) clickable: boolean | undefined;

    public mounted() {
        Vue.use(VueClipboard);
    }

    // endregion

    // region Methods

    public copy() {
        if (this.value && this.copyValue !== false) {
            this.$copyText(this.value);
            this.notifySuccess('Copié dans le presse-papier');
        }
    }

    public getTextColor(classToAdd = '') {
        if (this.color) {
            return `text-${this.color} ${classToAdd}`;
        }
        return classToAdd;
    }

    // endregion
}
</script>
