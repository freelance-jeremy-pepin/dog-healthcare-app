<template>
    <q-item-section avatar>
        <q-avatar class="text-white" color="purple">
            {{ professional.name[0].toUpperCase() }}
        </q-avatar>
    </q-item-section>
</template>

<script lang="ts">
import {
    Component,
    Prop,
    Vue,
} from 'vue-property-decorator';
import { Professional } from 'src/models/professional';
import ItemIcon from 'components/common/ItemIcon.vue';

@Component({
    components: { ItemIcon },
})
export default class ProfessionalIdentityAvatar extends Vue {
    // region Props

    @Prop({ required: true }) professional: Professional | undefined;

    // endregion
}
</script>
