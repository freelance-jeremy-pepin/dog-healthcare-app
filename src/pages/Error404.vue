<template>
    <div class="fixed-center text-center">
        <p>
            <img
                alt="error"
                src="../assets/sad.svg"
                style="width:30vw;max-width:150px;"
            >
        </p>
        <p class="text-faded">
            Sorry, nothing here...<strong>(404)</strong>
        </p>
        <q-btn
            color="secondary"
            label="Go back"
            style="width:200px;"
            to="/"
        />
    </div>
</template>

<script lang="ts">
import {
    Component,
    Vue,
} from 'vue-property-decorator';

@Component
export default class Error404 extends Vue {

}
</script>
