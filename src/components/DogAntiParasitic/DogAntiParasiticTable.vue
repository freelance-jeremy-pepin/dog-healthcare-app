<template>
    <div>
        <table-edit
            :columns="columns"
            :data="antiParasitics"
            title="Anti-parasitaires"
            @delete="deleteAntiParasitic"
            @edit="editAntiParasitic"
        >
            <template v-slot:rows="props">
                <q-td key="date" :props="props.props">
                    {{ props.props.row.date | toDate }}
                </q-td>

                <q-td key="antiParasiticName" :props="props.props">
                    {{ props.props.row.antiParasiticName }}
                </q-td>

                <q-td key="caredBy" :props="props.props">
                    <span v-if="props.props.row.caredByOwner">Moi</span>
                    <span v-else class="cursor-pointer link">
              {{ props.props.row.caredByProfessionalDetails.name }}

              <q-popup-proxy :breakpoint="100000" class="bg-white">
                  <professional-identity-card
                      :professional-id="getIdFromIRI(props.props.row.caredByProfessional)"
                  />
              </q-popup-proxy>
            </span>
                </q-td>

                <q-td key="notes" :props="props.props">
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

        <dog-anti-parasitic-form
            v-model="dogAntiParasiticForm.display"
            :anti-parasitic="dogAntiParasiticForm.antiParasitic"
        ></dog-anti-parasitic-form>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Mixins,
    Prop,
} from 'vue-property-decorator';
import ActiveDogModule from 'src/store/modules/active-dog-module';
import DateTimeMixin from 'src/mixins/dateTimeMixin';
import { getIdFromIRI } from 'src/utils/stringFormat';
import ProfessionalIdentityCard
    from 'components/Professional/ProfessionalIdentity/ProfessionalIdentityCard.vue';
import TableEdit from 'components/common/TableEdit.vue';
import { AntiParasitic } from 'src/models/antiParasitic';
import AntiParasiticRepository from 'src/repositories/AntiParasiticRepository';
import DogAntiParasiticForm from 'components/DogAntiParasitic/DogAntiParasiticForm.vue';

@Component({
    components: {
        DogAntiParasiticForm, TableEdit, ProfessionalIdentityCard,
    },
})
export default class DogAntiParasiticTable extends Mixins(DateTimeMixin) {
    // *** Props ***
    @Prop({ required: true }) antiParasitics: AntiParasitic[] | undefined;

    // *** Data ***
    private columns = [
        {
            name: 'date',
            label: 'Date',
            align: 'left',
        },
        {
            name: 'antiParasiticName',
            label: 'Nom de l\'anti-parasitaire',
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

    private dogAntiParasiticForm = {
        display: false,
        antiParasitic: {} as AntiParasitic,
    }

    // *** Methods ***
    public deleteAntiParasitic = (antiParasitic: AntiParasitic) => {
        const antiParasiticRepository = new AntiParasiticRepository();
        antiParasiticRepository.delete(antiParasitic).then(() => {
            ActiveDogModule.fetchAntiParasitics();
        });
    };

    public editAntiParasitic = (antiParasitic: AntiParasitic) => {
        this.dogAntiParasiticForm.antiParasitic = antiParasitic;
        this.dogAntiParasiticForm.display = true;
    };

    public getIdFromIRI = (iri: string): number => getIdFromIRI(iri);
}
</script>

<style scoped>

</style>
