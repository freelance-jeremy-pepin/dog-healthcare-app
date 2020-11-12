<!--suppress ALL -->
<template>
    <q-layout class="shadow-2 rounded-borders" style="background-color: #EEEEEE" view="hHh Lpr lff">
        <q-header>
            <q-toolbar>
                <q-btn dense flat icon="menu" round @click="drawerLeft = !drawerLeft" />
                <q-toolbar-title>
                    Carnet de santé pour chiens
                </q-toolbar-title>
                <user-avatar></user-avatar>
            </q-toolbar>
        </q-header>

        <q-drawer
            v-model="drawerLeft"
            :breakpoint="500"
            :width="250"
            bordered
            show-if-above
        >
            <q-scroll-area class="fit">
                <q-list class="menu-list q-mr-md" padding>
                    <q-item
                        v-for="route in routes"
                        :key="route.routeName"
                        v-ripple
                        :exact="route.exact"
                        :to="{ name: route.routeName }"
                        class="q-mb-sm"
                        clickable
                    >
                        <q-item-section avatar>
                            <q-icon :name="route.icon" />
                        </q-item-section>

                        <q-item-section>
                            {{ route.label }}
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-scroll-area>
        </q-drawer>

        <q-page-container>
            <slot></slot>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script lang="ts">
import {
    Component,
    Vue,
} from 'vue-property-decorator';
import Auth from 'src/api/auth';
import UserAvatar from 'components/UserAvatar.vue';

interface Route {
    icon: string;
    label: string;
    routeName: string;
    exact: boolean;
}

@Component({
    components: {
        UserAvatar,
    },
})
export default class MainLayout extends Vue {
    // region Data

    private drawerLeft = false;

    private routes: Route[] = [
        {
            icon: 'pets',
            label: 'Carnet de santé',
            routeName: 'home',
            exact: true,
        },
        {
            icon: 'supervisor_account',
            label: 'Professionnels',
            routeName: 'professionals',
            exact: false,
        },
    ];

    // endregion

    // region Hooks

    public mounted() {
        window.addEventListener('storage', Auth.syncLogout);
        document.title = 'Carnet de santé pour chiens';
    }

    // endregion
}
</script>

<style scoped>
.menu-list .q-item {
    border-radius: 0 32px 32px 0;
}

.q-router-link--active {
    background-color: #e6f1fc;
}
</style>
