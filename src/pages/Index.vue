<template>
  <div>
    <q-page class="column items-center" padding>
      <div class="q-gutter-md" style="max-width: 500px; width: 100%; margin-bottom: 70px">
        <dog-identity :dog="activeDog"></dog-identity>
        <dog-weight :weights="weights"></dog-weight>
      </div>
    </q-page>

    <q-page-sticky :offset="[18, 18]" position="bottom-right">
      <q-fab color="green" direction="up" icon="add">
        <q-fab-action @click="addWeightDisplay = true" color="primary" label="Poids" />
      </q-fab>
    </q-page-sticky>

    <q-page-sticky :offset="[80, 18]" position="bottom-right">
      <q-btn
        :color="isActiveDogEditing ? 'green' : 'orange'"
        :icon="isActiveDogEditing ? 'done' : 'edit'"
        @click="toggleActiveDogEditing"
        round
        size="sm"
      />
    </q-page-sticky>

    <add-dog-weight v-model="addWeightDisplay"></add-dog-weight>
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
import AddDogWeight from 'components/DogWeight/AddDogWeight.vue';
import moment from 'moment';
import store from 'src/store';
import ActiveDogModule from '../store/modules/active-dog-module';
import UserModule from '../store/modules/user-module';
import DogModule from '../store/modules/dog-module';

@Component({
  components: {
    AddDogWeight,
    DogIdentity,
    DogWeight,
  },
})
export default class Index extends Vue {
  // *** Data ***
  private addWeightDisplay = false;

  // *** Computed properties ***
  // eslint-disable-next-line class-methods-use-this
  public get user(): User | undefined {
    return UserModule.User;
  }

  // eslint-disable-next-line class-methods-use-this
  public get activeDog(): Dog | undefined {
    return UserModule.User?.activeDog;
  }

  // eslint-disable-next-line class-methods-use-this
  public get weights(): Weight[] | undefined {
    return ActiveDogModule.Weights;
  }

  // eslint-disable-next-line class-methods-use-this
  public get isActiveDogEditing(): boolean {
    return ActiveDogModule.IsEditing;
  }

  // *** Hooks ***
  public mounted() {
    moment.locale('fr');
    store.registerModule('active-dog', {});
  }

  // *** Methods ***
  public toggleActiveDogEditing = () => {
    ActiveDogModule.setEditing(!ActiveDogModule.IsEditing);
  };

  // *** Watcher ***
  @Watch('user', { deep: true })
  // eslint-disable-next-line class-methods-use-this
  public onUserChanged(user: User | undefined) {
    if (user && !user.activeDog && DogModule.Dogs && DogModule.Dogs.length > 0) {
      UserModule.setActiveDog(DogModule.Dogs[0]);
    }
  }

  @Watch('activeDog')
  // eslint-disable-next-line class-methods-use-this
  public onActiveDogChanged(newDog: Dog | undefined) {
    ActiveDogModule.refreshDog(newDog);
  }
}
</script>
