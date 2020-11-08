<template>
    <div>
        <div class="bg-image window-height window-width"></div>

        <q-page class="page window-height window-width row justify-center items-center">
            <q-card bordered class="card text-primary">
                <q-card-section class="q-pa-lg">
                    <div class="text-accent text-h6">Carnet de santé pour chiens</div>
                </q-card-section>

                <q-separator></q-separator>

                <q-card-section class="q-pa-lg">
                    <q-form class="q-gutter-md">
                        <q-input v-model="email" clearable label="E-mail" outlined type="email" />
                        <q-input
                            v-model="password"
                            clearable
                            label="Mot de passe"
                            outlined
                            type="password"
                        />
                    </q-form>
                    <q-checkbox v-model="rememberMe" label="Se souvenir de moi" />
                </q-card-section>

                <q-card-actions class="q-px-lg q-pb-lg q-pt-none">
                    <q-btn
                        :loading="loading"
                        class="full-width"
                        color="primary"
                        label="Se connecter"
                        size="lg"
                        @click="handleSubmit"
                    />
                </q-card-actions>
            </q-card>
        </q-page>
    </div>

</template>

<script lang="ts">
import {
    Component,
    Vue,
} from 'vue-property-decorator';
import Auth from 'src/api/auth';
import axios from 'axios';

@Component
export default class LoginForm extends Vue {
    private email = '';

    private password = '';

    private rememberMe = false;

    private loading = false;

    // noinspection JSUnusedGlobalSymbols
    public mounted() {
        Auth.logout(false);

        this.rememberMe = Auth.rememberMe;
    }

    public handleSubmit() {
        this.loading = true;

        axios.post('authentication_token', {
            email: this.email,
            password: this.password,
        }).then((response) => {
            localStorage.setItem('rememberMe', this.rememberMe.toString());
            this.login(response.data.token, response.data.refresh_token, false);
        }).finally(() => {
            this.loading = false;
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
.card {
    width: 100%;
    max-width: 396px;
}

.bg-image {
    background-image: url("../assets/noky2.jpg");

    /* Add the blur effect */
    filter: blur(8px);
    -webkit-filter: blur(8px);

    /* Full height */
    height: 100%;

    /* Center and scale the image nicely */
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}

.page {
    background-color: rgb(0, 0, 0); /* Fallback color */
    background-color: rgba(0, 0, 0, 0.4); /* Black w/opacity/see-through */
    color: white;
    font-weight: bold;
    /*border: 3px solid #f1f1f1;*/
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    width: 80%;
    padding: 20px;
    text-align: center;
}
</style>
