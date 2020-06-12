import {
  Component,
  Vue,
} from 'vue-property-decorator';

@Component
export default class ValidationMixin extends Vue {
  private emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;

  private phoneNumberPattern = /^((\+)33|0)[1-9](\d{2}){4}$/;

  private lettersOnlyPattern = /\d+/;

  private floatPattern = /^(?:[1-9]\d*|0)?(?:\.\d+)?$/;

  public emailValidation = (val: string) => (val === '' ? true : this.emailPattern.test(val) || 'Veuillez entrer un email valide');

  public phoneNumberValidation = (val: string) => (val === '' ? true : this.phoneNumberPattern.test(val) || 'Veuillez entrer un n° de téléphone valide');

  public lettersOnlyValidation = (val: string) => (val === '' ? true : !this.lettersOnlyPattern.test(val) || 'Chiffres non acceptés dans ce champ');

  public floatValidation = (val: string) => (val === '' ? true : this.floatPattern.test(val) || 'Veuillez saisir un nombre valide');

  public required = (val: string) => !!val || 'Ce champs est requis';
}
