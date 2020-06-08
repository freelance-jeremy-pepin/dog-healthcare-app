import { BaseModel } from 'src/models/baseModel';
import axios from 'axios';

export default abstract class BaseRepository<T extends BaseModel> {
  protected baseIri = '';

  protected constructor(endpoint: string) {
    this.baseIri = `api/${endpoint}`;
  }

  public get BaseIri(): string {
    return this.baseIri;
  }

  // *** CREATE ***
  public add(model: T): Promise<T> {
    return new Promise((resolve, reject) => {
      axios.post(this.baseIri, model).then(({ data }) => {
        resolve(data);
      }).catch(() => {
        reject();
      });
    });
  }

  // *** READ ***
  public getAll(): Promise<T[]> {
    return new Promise((resolve, reject) => {
      axios.get(this.baseIri).then(({ data }) => {
        resolve(data);
      }).catch(() => {
        reject();
      });
    });
  }


  public getById(id: number): Promise<T> {
    return new Promise((resolve, reject) => {
      axios.get(`${this.baseIri}/${id}`).then(({ data }) => {
        resolve(data);
      }).catch(() => {
        reject();
      });
    });
  }

  // *** UPDATE ***
  public update(model: T): Promise<T> {
    return new Promise((resolve, reject) => {
      axios.put(`${this.baseIri}/${model.id}`, model).then(({ data }) => {
        resolve(data);
      }).catch(() => {
        reject();
      });
    });
  }

  // *** DELETE ***
  public delete(model: T): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios.delete(`${this.baseIri}/${model.id}`).then(({ data }) => {
        resolve(data);
      }).catch(() => {
        reject();
      });
    });
  }
}
