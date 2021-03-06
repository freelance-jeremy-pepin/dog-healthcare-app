<template>
    <div>
        <q-page class="column items-center" padding>
            <div class="q-gutter-md" style="max-width: 500px; width: 100%; margin-bottom: 70px">
                <dog-identity :dog="activeDog"></dog-identity>
                <dog-weight :weights="weights"></dog-weight>
                <dog-deworming :dewormings="dewormings"></dog-deworming>
                <dog-anti-parasitic :anti-parasitics="antiParasitics"></dog-anti-parasitic>
            </div>
        </q-page>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Vue,
    Watch,
} from 'vue-property-decorator';
import DogIdentity from 'components/DogIdentity.vue';
import { Dog } from 'src/models/dog';
import DogWeight from 'components/DogWeight/DogWeight.vue';
import { Weight } from 'src/models/weight';
import { User } from 'src/models/user';
import DogWeightAdd from 'components/DogWeight/DogWeightForm.vue';
import moment from 'moment';
import store from 'src/store';
import DogDewormingForm from 'components/DogDeworming/DogDewormingForm.vue';
import DogDeworming from 'components/DogDeworming/DogDeworming.vue';
import { Deworming } from 'src/models/deworming';
import { AntiParasitic } from 'src/models/antiParasitic';
import DogAntiParasitic from 'components/DogAntiParasitic/DogAntiParasitic.vue';
import ActiveDogModule from '../store/modules/active-dog-module';
import UserModule from '../store/modules/user-module';
import DogModule from '../store/modules/dog-module';

@Component({
    components: {
        DogAntiParasitic,
        DogDeworming,
        DogDewormingForm,
        DogWeightAdd,
        DogIdentity,
        DogWeight,
    },
})
export default class Index extends Vue {
    // region Computed properties

    public get user(): User | undefined {
        return UserModule.User;
    }

    public get activeDog(): Dog | undefined {
        return UserModule.User?.activeDog;
    }

    public get weights(): Weight[] | undefined {
        return ActiveDogModule.Weights;
    }

    public get dewormings(): Deworming[] | undefined {
        return ActiveDogModule.Dewormings;
    }

    public get antiParasitics(): AntiParasitic[] | undefined {
        return ActiveDogModule.AntiParasitics;
    }

    // endregion

    // region Hooks

    public mounted() {
        moment.locale('fr');
        store.registerModule('active-dog', {});
    }

    // endregion

    // region Watcher

    @Watch('user', { deep: true })
    public onUserChanged(user: User | undefined) {
        if (user && !user.activeDog && DogModule.Dogs && DogModule.Dogs.length > 0) {
            UserModule.setActiveDog(DogModule.Dogs[0]);
        }
    }

    @Watch('activeDog')
    public onActiveDogChanged(newDog: Dog | undefined) {
        ActiveDogModule.refreshDog(newDog);
    }

    // endregion
}
</script>
