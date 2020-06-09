import {
  Component,
  Vue,
} from 'vue-property-decorator';

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
}
