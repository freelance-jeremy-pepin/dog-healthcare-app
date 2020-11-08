<template>
    <q-input v-model="$attrs.value" v-bind="$attrs" v-on="$listeners">
        <template v-slot:append>
            <q-icon :name="icon" />
        </template>
    </q-input>
</template>

<script lang="ts">
import {
    Component,
    Prop,
    Vue,
} from 'vue-property-decorator';

@Component
export default class InputIcon extends Vue {
    @Prop({ required: true }) icon: string | undefined;
}
</script>

<style scoped>

</style>
