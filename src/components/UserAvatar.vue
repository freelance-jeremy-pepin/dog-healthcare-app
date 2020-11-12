<template>
    <div>
        <q-btn :loading="isLoading" flat round>
            <q-avatar v-if="!isLoading" color="orange" size="md">{{ letter }}</q-avatar>

            <q-menu :offset="[5, -40]">
                <div class="row no-wrap q-pa-lg">
                    <div class="column items-center">
                        <q-avatar class="text-white" color="orange" size="72px">
                            {{ letter }}
                        </q-avatar>

                        <div class="text-subtitle1 text-bold q-mt-md q-mb-md">
                            {{ firstname }} {{ lastname }}
                        </div>

                        <!--<q-select-->
                        <!--  :options="dogs"-->
                        <!--  class="full-width q-py-md"-->
                        <!--  label="Chien actif"-->
                        <!--  option-label="name"-->
                        <!--  option-value="id"-->
                        <!--  outlined-->
                        <!--  v-model="activeDog"-->
                        <!--/>-->

                        <q-btn
                            color="primary"
                            label="Se déconnecter"
                            @click="logout"
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
    public get letter(): string {
        if (UserModule.User && UserModule.User.firstname && UserModule.User.lastname) {
            return UserModule.User.firstname[0].toUpperCase() + UserModule.User.lastname[0].toUpperCase();
        }
        return '';
    }

    public get firstname(): string {
        if (UserModule.User) {
            return UserModule.User.firstname;
        }
        return '';
    }

    public get lastname(): string {
        if (UserModule.User) {
            return UserModule.User.lastname;
        }
        return '';
    }

    public get isLoading(): boolean {
        return !UserModule.User;
    }

    logout = () => {
        Auth.logout();
    }
}
</script>
