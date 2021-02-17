import {
    Component,
    Vue,
} from 'vue-property-decorator';
import { AxiosError } from 'axios';

@Component
export default class NotifyMixin extends Vue {
    /**
     * Affiche une notification de succès.
     * @param {!string} message Message à afficher.
     */
    public notifySuccess(message: string): void {
        this.$q.notify({
            type: 'positive',
            message,
            textColor: 'white',
            classes: 'text-white',
            actions: [{ label: 'Fermer', color: 'white' }],
        });
    }

    /**
     * Affiche une notification d'erreur.
     * @param {!string} message Message à afficher.
     */
    public notifyError(message: string): void {
        this.$q.notify({
            type: 'negative',
            message,
            actions: [{ label: 'Fermer', color: 'white' }],
        });
    }

    /**
     * Affiche une notification d'avertissement.
     * @param {!string} message Message à afficher.
     */
    public notifyWarning(message: string): void {
        this.$q.notify({
            type: 'warning',
            message,
            actions: [{ label: 'Fermer', color: 'white' }],
        });
    }

    /**
     * Affiche une notification d'info.
     * @param {!string} message Message à afficher.
     */
    public notifyInfo(message: string): void {
        this.$q.notify({
            type: 'info',
            message,
            actions: [{ label: 'Fermer', color: 'white' }],
        });
    }

    /**
     * Affiche une notification d'erreur à partir d'une erreur Axios.
     * @param {!AxiosError} error Erreur Axios qui sera formatée pour afficher une erreur lisible.
     */
    public notifyErrorAxios(error: AxiosError | Error): void {
        let message = null;

        if (`response` in error && error.response?.data.message) {
            message = error.response.data.message;
        } else if (error.message) {
            message = error.message;
        } else {
            message = `Une erreur s'est produite.`;
        }

        this.$q.notify({
            type: 'negative',
            message,
            actions: [
                { label: 'Fermer', color: 'white' },
            ],
        });
    }
}
