<template>
  <q-page class="column items-center" padding>
    <div class="q-gutter-md" style="max-width: 500px; width: 100%">
      <dog-identity :dog="activeDog"></dog-identity>
      <dog-weight :weights="weights"></dog-weight>
    </div>
  </q-page>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Watch,
} from 'vue-property-decorator';
import DogIdentity from 'components/DogIdentity.vue';
import { Dog } from 'src/models/dog';
import DogWeight from 'components/DogWeight.vue';
import { Weight } from 'src/models/weight';
import ActiveDogModule from '../store/modules/active-dog-module';
import UserModule from '../store/modules/user-module';

@Component({
  components: {
    DogIdentity,
    DogWeight,
  },
})
export default class Index extends Vue {
  // eslint-disable-next-line class-methods-use-this
  public get activeDog(): Dog | undefined {
    return UserModule.User?.activeDog;
  }

  // eslint-disable-next-line class-methods-use-this
  public get weights(): Weight[] | undefined {
    return ActiveDogModule.Weights;
  }

  @Watch('activeDog')
  // eslint-disable-next-line class-methods-use-this
  public onActiveDogChanged(newDog: Dog) {
    ActiveDogModule.refreshDog(newDog);
  }
}
</script>
