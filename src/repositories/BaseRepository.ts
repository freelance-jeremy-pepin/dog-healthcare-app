import { BaseModel } from 'src/models/baseModel';
import axios, { AxiosRequestConfig } from 'axios';
import Date from 'src/utils/date';
import DateTime from 'src/utils/dateTime';

export default abstract class BaseRepository<T extends BaseModel> {
  protected date: string[] | undefined;

  protected dateTime: string[] | undefined;

  protected baseIri = '';

  protected constructor(endpoint: string) {
    this.baseIri = `api/${endpoint}`;
  }

  public get BaseIri(): string {
    return this.baseIri;
  }

  public buildIri(id: number): string {
    return `${this.baseIri}/${id.toString()}`;
  }

  // *** CREATE ***
  public add(model: T): Promise<T> {
    model = this.formatDateAppToDatabase(model);
    return new Promise((resolve, reject) => {
      axios.post(this.baseIri, model).then(({ data }: { data: T }) => {
        resolve(data);
      }).catch(() => {
        reject();
      });
    });
  }

  // *** READ ***
  public getAll(): Promise<T[]> {
    return this.fetchMany(this.baseIri);
  }

  public getById(id: number): Promise<T> {
    return this.fetchOne(`${this.baseIri}/${id}`);
  }

  // *** UPDATE ***
  public update(model: T): Promise<T> {
    model = this.formatDateAppToDatabase(model);
    return new Promise((resolve, reject) => {
      axios.put(`${this.baseIri}/${model.id}`, model).then(({ data }: { data: T }) => {
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

  // *** Protected methods ***
  protected fetchMany(url: string, config?: AxiosRequestConfig): Promise<T[]> {
    return new Promise((resolve, reject) => {
      axios.get(url, config).then(({ data }: { data: T[] }) => {
        data = data.map((d: T) => this.formatDateDatabaseToApp(d));
        resolve(data);
      }).catch(() => {
        reject();
      });
    });
  }

  protected fetchOne(url: string): Promise<T> {
    return new Promise((resolve, reject) => {
      axios.get(url).then(({ data }: { data: T }) => {
        data = this.formatDateDatabaseToApp(data);
        resolve(data);
      }).catch(() => {
        reject();
      });
    });
  }

  // *** Private methods ***
  private formatDateAppToDatabase(model: T): T {
    if (this.date) {
      this.date.forEach((d: string) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        model[d] = Date.appToDatabase(model[d]);
      });
    }

    if (this.dateTime) {
      this.dateTime.forEach((d: string) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        model[d] = DateTime.appToDatabase(model[d]);
      });
    }

    return model;
  }

  private formatDateDatabaseToApp(model: T): T {
    if (this.date) {
      this.date.forEach((d: string) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        model[d] = Date.databaseToApp(model[d]);
      });
    }

    if (this.dateTime) {
      this.dateTime.forEach((d: string) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        model[d] = DateTime.databaseToApp(model[d]);
      });
    }

    return model;
  }
}
