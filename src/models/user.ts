import { Dog } from 'src/models/dog';

export interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  activeDog?: Dog;
}
