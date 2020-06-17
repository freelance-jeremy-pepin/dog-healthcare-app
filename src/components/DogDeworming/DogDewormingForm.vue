<template>
  <q-dialog
    @before-show="reset"
    position="bottom"
    ref="modal"
    v-bind="$attrs"
    v-if="activeDog"
    v-model="$attrs.value"
    v-on="$listeners"
  >
    <q-card>
      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">
          {{ `${labelAction} une prise de vermifuge pour ${activeDog.name}` }}
        </div>
        <q-form @submit="onSubmit" class="column q-gutter-md" v-if="dewormingEditing">
          <q-input
            :rules="[required]"
            hide-bottom-space
            label="Date"
            outlined
            v-model="dewormingEditing.date"
          >
            <template v-slot:append>
              <q-icon class="cursor-pointer" name="event">
                <q-popup-proxy ref="qDateProxy" transition-hide="scale" transition-show="scale">
                  <q-date
                    :options="limitDatesNoFutur"
                    @input="() => $refs.qDateProxy.hide()"
                    mask="DD/MM/YYYY"
                    today-btn
                    v-model="dewormingEditing.date"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input
            :rules="[required]"
            hide-bottom-space
            label="Nom du vermifuge"
            outlined
            v-model="dewormingEditing.dewormingName"
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
            v-if="caredBy === 'professional'"
            v-model="professionalSelected"
            @get-all-success="onGetAllSuccessProfessional"
          />

          <q-input
            autogrow
            label="Notes"
            outlined
            type="textarea"
            v-model="dewormingEditing.notes"
          />

          <q-toggle label="Mettre à jour la date de prochaine prise" v-model="updateReminder" />

          <q-btn :label="labelAction" color="positive" type="submit" />
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
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
import { Deworming } from 'src/models/deworming';
import Date from 'src/utils/date';
import DewormingRepository from 'src/repositories/DewormingRepository';
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

enum CaredBy {
  owner = 'owner',
  professional = 'professional'
}

@Component({
  components: { ProfessionalSelect },
})
export default class DogDewormingForm extends Mixins(ValidationMixin, DateMixin) {
  // *** Props ***
  @Prop({ required: false, default: undefined }) deworming: Deworming | undefined;

  // *** Data ***
  private dewormingEditing: Deworming | null = null;

  private professionalSelected: Professional | null = null;

  private caredBy: CaredBy | null = null;

  private updateReminder = true;

  // *** Computed properties ***
  // eslint-disable-next-line class-methods-use-this
  public get activeDog(): Dog | undefined {
    return ActiveDogModule.Dog;
  }

  public get labelAction(): string {
    return this.deworming ? 'Modifier' : 'Ajouter';
  }

  // *** Events handlers ***
  public onGetAllSuccessProfessional(professionals: Professional[]) {
    if (this.deworming && this.deworming.caredByProfessional) {
      const professionalId: number = getIdFromIRI(this.deworming.caredByProfessional);
      // eslint-disable-next-line max-len
      this.professionalSelected = professionals.find((p: Professional) => p.id === professionalId) || null;
    }
  }

  // *** Methods ***
  public emptyDeworming(): Deworming {
    return {
      dog: `${(new DogRepository().BaseIri)}/${this.activeDog?.id}`,
      date: moment().format(Date.appFormat),
      caredByOwner: true,
      caredByProfessional: undefined,
      dewormingName: '',
      notes: undefined,
    };
  }

  public reset() {
    this.updateReminder = true;
    this.professionalSelected = null;

    if (this.deworming) {
      this.dewormingEditing = {
        ...this.deworming,
        date: moment(this.deworming.date, DateTime.appFormat).format(Date.appFormat),
      };

      if (this.deworming.caredByProfessional) {
        this.caredBy = CaredBy.professional;
      } else if (this.deworming.caredByOwner) {
        this.caredBy = CaredBy.owner;
      }
    } else {
      this.dewormingEditing = this.emptyDeworming();

      this.caredBy = CaredBy.owner;
    }
  }

  public setCaredByProfessional(professional: Professional | null) {
    if (professional && this.dewormingEditing) {
      const professionalRepository = new ProfessionalRepository();
      this.dewormingEditing.caredByProfessional = this.caredBy === CaredBy.professional
        ? professionalRepository.buildIri(professional)
        : undefined;
    } else if (this.dewormingEditing) {
      this.professionalSelected = null;
      this.dewormingEditing.caredByProfessional = null;
    }
  }

  // *** Events handlers ***
  public onSubmit() {
    if (this.dewormingEditing) {
      const deworming: Deworming = { ...this.dewormingEditing };

      const dewormingRepository = new DewormingRepository();
      if (this.deworming) {
        dewormingRepository.update(deworming).then(() => {
          this.submitSuccessCallback();
        });
      } else {
        dewormingRepository.add(deworming).then(() => {
          this.submitSuccessCallback();
        });
      }
    }
  }

  public submitSuccessCallback() {
    ActiveDogModule.fetchDewormings();

    if (this.updateReminder) {
      // eslint-disable-next-line max-len
      const reminder: Reminder | undefined = ActiveDogModule.Reminder(ReminderTableName.deworming);
      if (reminder) {
        const dewormingRepository = new DewormingRepository();
        dewormingRepository.updateNextReminder({ ...reminder }).then(() => {
          ActiveDogModule.fetchReminders();
        });
      }
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    this.$refs.modal.hide();
  }

  // *** Watchers ***
  @Watch('caredBy')
  public onCaredByChanged() {
    if (this.caredBy && this.dewormingEditing) {
      this.dewormingEditing.caredByOwner = this.caredBy === CaredBy.owner;
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
