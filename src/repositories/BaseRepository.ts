import { BaseModel } from 'src/models/baseModel';
import axios, {
    AxiosError,
    AxiosRequestConfig
} from 'axios';
import Date from 'src/utils/date';
import DateTime from 'src/utils/dateTime';

export default abstract class BaseRepository<T extends BaseModel> {
    protected date: string[] | undefined;

    protected dateTime: string[] | undefined;

    protected baseIri = '';

    protected constructor(endpoint: string) {
        this.baseIri = `${endpoint}`;
    }

    public get BaseIri(): string {
        return this.baseIri;
    }

    private static addRelationsToConfig(
        relations: string[],
        config?: AxiosRequestConfig,
    ): AxiosRequestConfig | undefined {
        if (relations) {
            if (!config) {
                config = {};
            }

            const relationsParams = {
                relations: relations.join(','),
            };

            if (config.params) {
                config.params = { ...config.params, ...relationsParams };
            } else {
                config.params = relationsParams;
            }
        }

        return config;
    }

    public buildIri(model: T): string {
        if (model.id) {
            return `${this.baseIri}/${model.id.toString()}`;
        }
        return '';
    }

    // *** CREATE ***
    public add(model: T): Promise<T> {
        model = this.formatDateAppToDatabase(model);
        return new Promise((resolve, reject) => {
            axios.post(this.baseIri, model).then(({ data }: { data: T }) => {
                resolve(data);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    // *** READ ***
    public getAll(): Promise<T[]> {
        return this.fetchMany();
    }

    public getById(id: number): Promise<T> {
        return this.fetchOne(`${id}`);
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
    protected fetchMany(
        url?: string,
        relations?: string[],
        config?: AxiosRequestConfig,
    ): Promise<T[]> {
        if (relations) {
            config = BaseRepository.addRelationsToConfig(relations, config);
        }

        url = `${this.baseIri}${url ? `/${url}` : ''}`;

        return new Promise((resolve, reject) => {
            axios.get(url, config).then(({ data }: { data: T[] }) => {
                data = data.map((d: T) => this.formatDateDatabaseToApp(d));
                resolve(data);
            }).catch((error: AxiosError) => {
                reject(error);
            });
        });
    }

    protected fetchOne(
        url: string,
        relations?: string[],
        config?: AxiosRequestConfig,
    ): Promise<T> {
        if (relations) {
            config = BaseRepository.addRelationsToConfig(relations, config);
        }

        url = `${this.baseIri}${url ? `/${url}` : ''}`;

        return new Promise((resolve, reject) => {
            axios.get(url, config).then(({ data }: { data: T }) => {
                data = this.formatDateDatabaseToApp(data);
                resolve(data);
            }).catch((error: AxiosError) => {
                reject(error);
            });
        });
    }

    // *** Private methods ***
    private formatDateAppToDatabase(model: T): T {
        if (this.date) {
            this.date.forEach((d: string) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                model[d] = model[d] ? Date.appToDatabase(model[d]) : null;
            });
        }

        if (this.dateTime) {
            this.dateTime.forEach((d: string) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                model[d] = model[d] ? DateTime.appToDatabase(model[d]) : null;
            });
        }

        return model;
    }

    private formatDateDatabaseToApp(model: T): T {
        if (this.date) {
            this.date.forEach((d: string) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                model[d] = model[d] ? Date.databaseToApp(model[d]) : null;
            });
        }

        if (this.dateTime) {
            this.dateTime.forEach((d: string) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                model[d] = model[d] ? DateTime.databaseToApp(model[d]) : null;
            });
        }

        return model;
    }
}
