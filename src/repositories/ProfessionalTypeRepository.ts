import BaseRepository from 'src/repositories/BaseRepository';
import { ProfessionalType } from 'src/models/professionalType';

export default class ProfessionalTypeRepository extends BaseRepository<ProfessionalType> {
  constructor() {
    super('professional_types');
  }
}
