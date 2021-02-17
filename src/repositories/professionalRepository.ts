import BaseRepository from 'src/repositories/baseRepository';
import { Professional } from 'src/models/professional';
import { ProfessionalType } from 'src/models/professionalType';

export enum ProfessionalRelations {
    professionalType = 'professionalType',
    antiParasitics = 'antiParasitics',
    dewormings = 'dewormings',
}

// eslint-disable-next-line max-len
export default class ProfessionalRepository extends BaseRepository<Professional, ProfessionalRelations> {
    constructor() {
        super('professional');
    }

    public getByProfessionalType(professionalType: ProfessionalType): Promise<Professional[]> {
        return this.fetchMany(this.baseIri, undefined, {
            params: {
                professionalType: professionalType.id,
            },
        });
    }
}
