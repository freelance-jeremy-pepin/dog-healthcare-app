<template>
    <q-card bordered>
        <q-expansion-item
            v-model="expanded"
            class="bg-white"
            expand-icon-class="q-pa-none"
            expand-separator
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
                    v-if="$slots['header-sub-label'] && !expanded"
                    class="text-subtitle2 text-grey"
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
    Prop,
    Vue,
    Watch,
} from 'vue-property-decorator';

@Component
export default class ExpandableCard extends Vue {
    // region Props

    @Prop({ required: true }) keyLocalStorage: string | undefined;

    // endregion

    // region Data

    private expanded = false;

    // endregion

    // region Hooks

    public mounted() {
        const expandedLocalStorage = localStorage.getItem(`${this.keyLocalStorage}.expanded`);
        if (expandedLocalStorage) {
            this.expanded = expandedLocalStorage === 'true';
        }
    }

    // endregion

    // region Watchers

    @Watch('expanded')
    public onExpandedChanged(value: boolean) {
        localStorage.setItem(`${this.keyLocalStorage}.expanded`, value.toString());
    }

    // endregion
}
</script>
