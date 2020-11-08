<template>
    <professional-form :professional-id="$route.params.professional_id"></professional-form>
</template>

<script lang="ts">
import {
    Component,
    Vue,
} from 'vue-property-decorator';
import ProfessionalForm from 'components/Professional/ProfessionalForm.vue';

@Component({
    components: { ProfessionalForm },
})
export default class ProfessionalsEdit extends Vue {

}
</script>

<style scoped>

</style>
