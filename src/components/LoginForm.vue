<template>
  <q-page class="bg-grey-green window-height window-width row justify-center items-center">
    <div class="column">
      <div class="row">
        <h5 class="text-h5 text-accent q-my-md">Dog Healthcare</h5>
      </div>
      <div class="row">
        <q-card bordered class="q-pa-lg shadow-1" square>
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input clearable filled label="email" square type="email" v-model="email" />
              <q-input
                clearable
                filled
                label="password"
                square
                type="password"
                v-model="password"
              />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn
              @click="handleSubmit"
              class="full-width"
              color="light-green-7"
              label="Login"
              size="lg"
              unelevated
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import { api } from 'src/api/appApi';
import Auth from 'src/api/auth';

@Component
export default class LoginForm extends Vue {
  private email = '';

  private password = '';

  public mounted() {
    Auth.logout(false);
  }

  public handleSubmit() {
    api.post('authentication_token', {
      email: this.email,
      password: this.password,
    }).then((response) => {
      this.login(response.data.token, response.data.refresh_token, false);
    });
  }

  public login(tokenPlainText: string, refreshToken: string, noRedirect: boolean) {
    Auth.login(tokenPlainText, refreshToken);

    if (!noRedirect) {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
  .q-card {
    width: 360px;
  }
</style>
