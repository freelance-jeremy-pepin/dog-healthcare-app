import BaseRepository from 'src/repositories/BaseRepository';
import { Professional } from 'src/models/professional';
import { ProfessionalType } from 'src/models/professionalType';
import ProfessionalTypeRepository from 'src/repositories/ProfessionalTypeRepository';
import { getIdFromIRI } from 'src/utils/stringFormat';

export default class ProfessionalRepository extends BaseRepository<Professional> {
    constructor() {
        super('professionals');
    }

    // eslint-disable-next-line max-len
    public getByProfessionalType = (professionalType: ProfessionalType): Promise<Professional[]> => this.fetchMany(this.baseIri, {
        params: {
            professionalType: professionalType.id,
        },
    });

    getAll(withProfessionalTypeDetails = false): Promise<Professional[]> {
        if (withProfessionalTypeDetails) {
            return new Promise((resolve, reject) => {
                const professionalTypeRepository = new ProfessionalTypeRepository();

                professionalTypeRepository.getAll().then((professionalTypes: ProfessionalType[]) => {
                    super.getAll().then((professionals: Professional[]) => {
                        professionals = professionals.map((p: Professional) => {
                            const professionalTypeId: number = getIdFromIRI(p.professionalType);
                            // eslint-disable-next-line max-len
                            p.professionalTypeDetails = professionalTypes.find((pt: ProfessionalType) => pt.id === professionalTypeId);
                            return p;
                        });
                        resolve(professionals);
                    });
                }).catch((error) => {
                    reject(error);
                });
            });
        }

        return super.getAll();
    }
}
