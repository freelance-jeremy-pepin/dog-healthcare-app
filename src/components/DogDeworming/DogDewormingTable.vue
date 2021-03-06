<template>
    <div>
        <table-edit
            :columns="columns"
            :data="dewormings"
            title="Vermifuges"
            @delete="deleteDeworming"
            @edit="editDeworming"
        >
            <template v-slot:rows="props">
                <q-td key="date" :props="props.props">
                    {{ props.props.row.date | toDate }}
                </q-td>

                <q-td key="dewormingName" :props="props.props">
                    {{ props.props.row.dewormingName }}
                </q-td>

                <q-td key="caredBy" :props="props.props">
                    <span v-if="props.props.row.caredByOwner">Moi</span>
                    <span v-else class="cursor-pointer link">
                        {{ props.props.row.caredByProfessional.name }}

                        <q-popup-proxy :breakpoint="100000" class="bg-white">
                            <professional-identity-card :professional-id="props.props.row.caredByProfessionalId" />
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

        <dog-deworming-form
            v-model="dogDewormingForm.display"
            :deworming="dogDewormingForm.deworming"
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
import DateTimeMixin from 'src/mixins/dateTimeMixin';
import { Deworming } from 'src/models/deworming';
import DewormingRepository from 'src/repositories/dewormingRepository';
import DogDewormingForm from 'components/DogDeworming/DogDewormingForm.vue';
import ProfessionalIdentityCard from 'components/Professional/ProfessionalIdentity/ProfessionalIdentityCard.vue';
import TableEdit from 'components/common/TableEdit.vue';

@Component({
    components: { TableEdit, ProfessionalIdentityCard, DogDewormingForm },
})
export default class DogDewormingTable extends Mixins(DateTimeMixin) {
    // region Props

    @Prop({ required: true }) dewormings: Deworming[] | undefined;

    // endregion

    // region Data

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

    // endregion

    // region Methods

    private deleteDeworming(deworming: Deworming) {
        const dewormingRepository = new DewormingRepository();
        dewormingRepository.delete(deworming)
            .then(() => {
                ActiveDogModule.fetchDewormings();
            });
    }

    private editDeworming(deworming: Deworming) {
        this.dogDewormingForm.deworming = deworming;
        this.dogDewormingForm.display = true;
    }

    // endregion
}
</script>
