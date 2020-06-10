import BaseRepository from 'src/repositories/BaseRepository';
import { Professional } from 'src/models/professional';
import { ProfessionalType } from 'src/models/professionalType';

export default class ProfessionalRepository extends BaseRepository<Professional> {
  constructor() {
    super('professionals');
  }

  // eslint-disable-next-line max-len
  public getByProfessionalType = (professionalType: ProfessionalType): Promise<Professional[]> => this.fetchMany(this.baseIri, {
    params: {
      professionalType: professionalType.id,
    },
  })
}
