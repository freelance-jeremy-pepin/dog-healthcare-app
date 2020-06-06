<template>
  <q-page class="column items-center" padding>
    <div class="q-gutter-md" style="max-width: 500px; width: 100%">
      <dog-identity :dog="activeDog"></dog-identity>
    </div>
  </q-page>
</template>

<script lang="ts">
import {
  Component,
  Vue,
} from 'vue-property-decorator';
import DogIdentity from 'components/DogIdentity.vue';
import { Dog } from 'src/models/dog';
import UserModule from '../store/modules/user-module';

@Component({
  components: {
    DogIdentity,
  },
})
export default class Index extends Vue {
  // eslint-disable-next-line class-methods-use-this
  public get activeDog(): Dog | undefined {
    return UserModule.User?.activeDog;
  }
}
</script>
