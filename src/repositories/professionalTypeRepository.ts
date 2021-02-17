import BaseRepository from 'src/repositories/baseRepository';
import { ProfessionalType } from 'src/models/professionalType';

export enum ProfessionalTypeRelations {
    professionals = 'professionals',
}

export default class ProfessionalTypeRepository
    extends BaseRepository<ProfessionalType, ProfessionalTypeRelations> {
    constructor() {
        super('professional-type');
    }
}
