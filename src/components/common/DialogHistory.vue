<template>
    <q-dialog
        v-model="$attrs.value"
        v-bind="$attrs"
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
