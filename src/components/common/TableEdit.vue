<template>
    <q-table
        :columns="columns"
        :data="data"
        :title="title"
        flat
        row-key="id"
        style="width: 100%"
    >
        <template v-slot:body="props">
            <q-tr :props="props" class="cursor-pointer">
                <q-menu context-menu touch-position>
                    <q-item
                        v-close-popup
                        clickable
                        @click="$emit('edit', props.row)"
                    >
                        <q-item-section>
                            <q-item-label>Editer</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-separator></q-separator>

                    <q-item
                        v-close-popup
                        clickable
                        @click="$emit('delete', props.row)"
                    >
                        <q-item-section>
                            <q-item-label class="text-negative">Supprimer</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-menu>

                <slot :props="props" name="rows"></slot>
            </q-tr>
        </template>
    </q-table>
</template>

<script lang="ts">
import {
    Component,
    Prop,
    Vue,
} from 'vue-property-decorator';

@Component
export default class TableEdit extends Vue {
    @Prop({ required: true }) columns: never[] | undefined;

    @Prop({ required: true }) data: never[] | undefined;

    @Prop({ required: true }) title: string | undefined;
}
</script>

<style scoped>

</style>
