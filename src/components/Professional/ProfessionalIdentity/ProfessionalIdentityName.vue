<template>
  <q-item-section>
    {{ professional.name }}
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
export default class ProfessionalIdentityName extends Vue {
  // *** Props ***
  @Prop({ required: true }) professional: Professional | undefined;
}
</script>

<style scoped>

</style>
