<template>
  <dialog-form
    :is-editing="!!antiParasitic"
    @reset="reset"
    @submit="onSubmit"
    ref="modal"
    title="%labelAction% une prise d'anti-parasitaire pour %activeDog.name%"
    v-bind="$attrs"
    v-model="$attrs.value"
    v-on="$listeners"
  >
    <template v-if="antiParasiticEditing" v-slot:form>
      <q-input
        :rules="[required]"
        hide-bottom-space
        label="Date"
        outlined
        v-model="antiParasiticEditing.date"
      >
        <template v-slot:append>
          <q-icon class="cursor-pointer" name="event">
            <q-popup-proxy ref="qDateProxy" transition-hide="scale" transition-show="scale">
              <q-date
                :options="limitDatesNoFutur"
                @input="() => $refs.qDateProxy.hide()"
                mask="DD/MM/YYYY"
                today-btn
                v-model="antiParasiticEditing.date"
              />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <q-input
        :rules="[required]"
        hide-bottom-space
        label="Nom de l'anti-parasitaire"
        outlined
        v-model="antiParasiticEditing.antiParasiticName"
      />

      <div class="row items-center">
        <span>Administré par</span>
        <q-radio label="moi" v-model="caredBy" val="owner" />
        <q-radio
          label="un professionnel"
          v-model="caredBy"
          val="professional"
        />
      </div>

      <professional-select
        :rules="[required]"
        @get-all-success="onGetAllSuccessProfessional"
        v-if="caredBy === 'professional'"
        v-model="professionalSelected"
      />

      <q-input
        autogrow
        label="Notes"
        outlined
        type="textarea"
        v-model="antiParasiticEditing.notes"
      />

      <q-toggle label="Mettre à jour la date de prochaine prise" v-model="updateReminder" />
    </template>
  </dialog-form>
</template>

<script lang="ts">
import {
  Component,
  Mixins,
  Prop,
  Watch,
} from 'vue-property-decorator';
import ActiveDogModule from 'src/store/modules/active-dog-module';
import DogRepository from 'src/repositories/DogRepository';
import { Dog } from 'src/models/dog';
import moment from 'moment';
import Date from 'src/utils/date';
import ProfessionalSelect from 'components/Professional/ProfessionalSelect.vue';
import { Professional } from 'src/models/professional';
import ValidationMixin from 'src/mixins/validationMixin';
import ProfessionalRepository from 'src/repositories/ProfessionalRepository';
import {
  Reminder,
  ReminderTableName,
} from 'src/models/reminder';
import DateMixin from 'src/mixins/dateMixin';
import DateTime from 'src/utils/dateTime';
import { getIdFromIRI } from 'src/utils/stringFormat';
import DialogForm from 'components/common/DialogForm.vue';
import { AntiParasitic } from 'src/models/antiParasitic';
import AntiParasiticRepository from 'src/repositories/AntiParasiticRepository';

enum CaredBy {
  owner = 'owner',
  professional = 'professional'
}

@Component({
  components: { DialogForm, ProfessionalSelect },
})
export default class DogAntiParasiticForm extends Mixins(ValidationMixin, DateMixin) {
  // *** Props ***
  @Prop({ required: false, default: undefined }) antiParasitic: AntiParasitic | undefined;

  // *** Data ***
  private antiParasiticEditing: AntiParasitic | null = null;

  private professionalSelected: Professional | null = null;

  private caredBy: CaredBy | null = null;

  private updateReminder = true;

  // *** Computed properties ***
  // eslint-disable-next-line class-methods-use-this
  public get activeDog(): Dog | undefined {
    return ActiveDogModule.Dog;
  }

  // *** Events handlers ***
  public onGetAllSuccessProfessional(professionals: Professional[]) {
    if (this.antiParasitic && this.antiParasitic.caredByProfessional) {
      const professionalId: number = getIdFromIRI(this.antiParasitic.caredByProfessional);
      // eslint-disable-next-line max-len
      this.professionalSelected = professionals.find((p: Professional) => p.id === professionalId) || null;
    }
  }

  // *** Methods ***
  public emptyAntiParasitic(): AntiParasitic {
    return {
      dog: `${(new DogRepository().BaseIri)}/${this.activeDog?.id}`,
      date: moment().format(Date.appFormat),
      caredByOwner: true,
      caredByProfessional: undefined,
      antiParasiticName: '',
      notes: undefined,
    };
  }

  public reset() {
    this.updateReminder = true;
    this.professionalSelected = null;

    if (this.antiParasitic) {
      this.antiParasiticEditing = {
        ...this.antiParasitic,
        date: moment(this.antiParasitic.date, DateTime.appFormat).format(Date.appFormat),
      };

      if (this.antiParasitic.caredByProfessional) {
        this.caredBy = CaredBy.professional;
      } else if (this.antiParasitic.caredByOwner) {
        this.caredBy = CaredBy.owner;
      }
    } else {
      this.antiParasiticEditing = this.emptyAntiParasitic();

      this.caredBy = CaredBy.owner;
    }
  }

  public setCaredByProfessional(professional: Professional | null) {
    if (professional && this.antiParasiticEditing) {
      const professionalRepository = new ProfessionalRepository();
      this.antiParasiticEditing.caredByProfessional = this.caredBy === CaredBy.professional
        ? professionalRepository.buildIri(professional)
        : undefined;
    } else if (this.antiParasiticEditing) {
      this.professionalSelected = null;
      this.antiParasiticEditing.caredByProfessional = null;
    }
  }

  public submitSuccessCallback() {
    ActiveDogModule.fetchAntiParasitics();

    if (this.updateReminder) {
      // eslint-disable-next-line max-len
      const reminder: Reminder | undefined = ActiveDogModule.Reminder(ReminderTableName.antiParasitic);
      if (reminder) {
        const antiParasiticRepository = new AntiParasiticRepository();
        antiParasiticRepository.updateNextReminder({ ...reminder }).then(() => {
          ActiveDogModule.fetchReminders();
        });
      }
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    this.$refs.modal.hide();
  }

  // *** Events handlers ***
  public onSubmit() {
    if (this.antiParasiticEditing) {
      const antiParasitic: AntiParasitic = { ...this.antiParasiticEditing };

      const antiParasiticRepository = new AntiParasiticRepository();
      if (this.antiParasitic) {
        antiParasiticRepository.update(antiParasitic).then(() => {
          this.submitSuccessCallback();
        });
      } else {
        antiParasiticRepository.add(antiParasitic).then(() => {
          this.submitSuccessCallback();
        });
      }
    }
  }

  // *** Watchers ***
  @Watch('caredBy')
  public onCaredByChanged() {
    if (this.caredBy && this.antiParasiticEditing) {
      this.antiParasiticEditing.caredByOwner = this.caredBy === CaredBy.owner;
      this.setCaredByProfessional(this.caredBy === CaredBy.professional
        ? this.professionalSelected
        : null);
    }
  }

  @Watch('professionalSelected', { deep: true })
  public onProfessionalSelectedChanged() {
    this.setCaredByProfessional(this.professionalSelected);
  }
}
</script>

<style scoped>

</style>