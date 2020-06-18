<template>
  <div>
    <table-edit
      :columns="columns"
      :data="dewormings"
      @delete="deleteDeworming"
      @edit="editDeworming"
      title="Vermifuges"
    >
      <template v-slot:rows="props">
        <q-td :props="props.props" key="date">
          {{ props.props.row.date | toDate }}
        </q-td>

        <q-td :props="props.props" key="dewormingName">
          {{ props.props.row.dewormingName }}
        </q-td>

        <q-td :props="props.props" key="caredBy">
          <span v-if="props.props.row.caredByOwner">Moi</span>
          <span class="cursor-pointer link" v-else>
              {{ props.props.row.caredByProfessionalDetails.name }}

              <q-popup-proxy :breakpoint="100000" class="bg-white">
                  <professional-identity-card
                    :professional-id="getIdFromIRI(props.props.row.caredByProfessional)"
                  />
              </q-popup-proxy>
            </span>
        </q-td>

        <q-td :props="props.props" key="notes">
          <span v-if="props.props.row.notes">
            <q-icon color="orange" name="note">
              <q-popup-proxy>
                <q-banner>
                  <template v-slot:avatar>
                    <q-icon color="orange" name="note" />
                  </template>
                  {{ props.props.row.notes }}
                </q-banner>
              </q-popup-proxy>
            </q-icon>
          </span>
        </q-td>
      </template>
    </table-edit>

    <dog-deworming-form
      :deworming="dogDewormingForm.deworming"
      v-model="dogDewormingForm.display"
    ></dog-deworming-form>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Mixins,
  Prop,
} from 'vue-property-decorator';
import ActiveDogModule from 'src/store/modules/active-dog-module';
import moment from 'moment';
import DateTimeMixin from 'src/mixins/dateTimeMixin';
import { Deworming } from 'src/models/deworming';
import DewormingRepository from 'src/repositories/DewormingRepository';
import DogDewormingForm from 'components/DogDeworming/DogDewormingForm.vue';
import { getIdFromIRI } from 'src/utils/stringFormat';
import ProfessionalIdentityCard
  from 'components/Professional/ProfessionalIdentity/ProfessionalIdentityCard.vue';
import TableEdit from 'components/common/TableEdit.vue';

@Component({
  components: { TableEdit, ProfessionalIdentityCard, DogDewormingForm },
})
export default class DogDewormingTable extends Mixins(DateTimeMixin) {
  // *** Props ***
  @Prop({ required: true }) dewormings: Deworming[] | undefined;

  // *** Data ***
  private columns = [
    {
      name: 'date',
      label: 'Date',
      align: 'left',
    },
    {
      name: 'dewormingName',
      label: 'Nom du vermifuge',
      align: 'left',
    },
    {
      name: 'caredBy',
      label: 'Fait par',
      align: 'left',
    },
    {
      name: 'notes',
      label: 'Notes',
      align: 'center',
    },
  ];

  private dogDewormingForm = {
    display: false,
    deworming: {} as Deworming,
  }

  // *** Methods ***
  public saveWeight = (deworming: Deworming) => {
    deworming.date += ` ${moment().format('HH:mm:ss')}`;
    ActiveDogModule.updateDeworming(deworming);
  };

  public deleteDeworming = (deworming: Deworming) => {
    const dewormingRepository = new DewormingRepository();
    dewormingRepository.delete(deworming).then(() => {
      ActiveDogModule.fetchDewormings();
    });
  };

  public editDeworming = (deworming: Deworming) => {
    this.dogDewormingForm.deworming = deworming;
    this.dogDewormingForm.display = true;
  };

  public getIdFromIRI = (iri: string): number => getIdFromIRI(iri);
}
</script>

<style scoped>

</style>
