import BaseRepository from 'src/repositories/BaseRepository';
import { Professional } from 'src/models/professional';

export default class ProfessionalRepository extends BaseRepository<Professional> {
  constructor() {
    super('professionals');
  }
}
