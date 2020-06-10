import BaseRepository from 'src/repositories/BaseRepository';
import { ProfessionalType } from 'src/models/professionalType';
import ProfessionalRepository from 'src/repositories/ProfessionalRepository';
import { Professional } from 'src/models/professional';

export default class ProfessionalTypeRepository extends BaseRepository<ProfessionalType> {
  constructor() {
    super('professional_types');
  }

  getAll(withProfessionals = false): Promise<ProfessionalType[]> {
    if (withProfessionals) {
      return new Promise((resolve, reject) => {
        const professionalRepository = new ProfessionalRepository();

        super.getAll().then((professionalTypes: ProfessionalType[]) => {
          const promises: Promise<void | Professional[]>[] = [];

          professionalTypes.forEach((pt: ProfessionalType) => {
            // eslint-disable-next-line max-len
            promises.push(professionalRepository.getByProfessionalType(pt).then((professionals: Professional[]) => {
              pt.professionals = professionals;
            }));
          });

          Promise.all(promises).then(() => {
            resolve(professionalTypes);
          });
        }).catch((error) => {
          reject(error);
        });
      });
    }

    return super.getAll();
  }
}
