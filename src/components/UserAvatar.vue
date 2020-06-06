<template>
  <div>
    <q-btn :loading="isLoading" flat round>
      <q-avatar color="orange" size="md" v-if="!isLoading">{{ letter }}</q-avatar>

      <q-menu :offset="[5, -40]">
        <div class="row no-wrap q-pa-md">
          <div class="column items-center">
            <q-avatar class="text-white" color="orange" size="72px">
              {{ letter }}
            </q-avatar>

            <div class="text-subtitle1 q-mt-md q-mb-xs">{{ firstname }} {{ lastname }}</div>

            <q-btn
              @click="logout"
              color="primary"
              label="Se déconnecter"
            />
          </div>
        </div>
      </q-menu>
    </q-btn>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
} from 'vue-property-decorator';
import Auth from 'src/api/auth';
import UserModule from '../store/modules/user-module';

@Component
export default class UserAvatar extends Vue {
  // eslint-disable-next-line class-methods-use-this
  public get letter(): string {
    if (UserModule.User) {
      return UserModule.User.firstname[0].toUpperCase() + UserModule.User.lastname[0].toUpperCase();
    }
    return '';
  }

  // eslint-disable-next-line class-methods-use-this
  public get email(): string {
    if (UserModule.User) {
      return UserModule.User.email;
    }
    return '';
  }

  // eslint-disable-next-line class-methods-use-this
  public get firstname(): string {
    if (UserModule.User) {
      return UserModule.User.firstname;
    }
    return '';
  }

  // eslint-disable-next-line class-methods-use-this
  public get lastname(): string {
    if (UserModule.User) {
      return UserModule.User.lastname;
    }
    return '';
  }

  // eslint-disable-next-line class-methods-use-this
  public get isLoading(): boolean {
    return !UserModule.User;
  }

  logout = () => {
    Auth.logout();
  }
}
</script>

<style scoped>

</style>
