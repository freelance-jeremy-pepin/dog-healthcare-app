<template>
    <q-btn
        v-bind="$attrs"
        v-on="$listeners"
        dense
        flat
        round
        size="12px"
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
