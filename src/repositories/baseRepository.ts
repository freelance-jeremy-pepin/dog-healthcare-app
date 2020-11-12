import { BaseModel } from 'src/models/baseModel';
import axios, {
    AxiosError,
    AxiosRequestConfig,
} from 'axios';

export default abstract class BaseRepository<T extends BaseModel, R> {
    protected baseIri = '';

    protected constructor(endpoint: string) {
        this.baseIri = `${endpoint}`;
    }

    public get BaseIri(): string {
        return this.baseIri;
    }

    // region CREATE

    public create(model: T): Promise<T> {
        return new Promise((resolve, reject) => {
            axios.post(this.baseIri, model)
                .then(({ data }: { data: T }) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    // endregion

    // region READ

    public getAll(relations?: R[]): Promise<T[]> {
        return this.fetchMany('', relations);
    }

    public getById(id: number, relations?: R[]): Promise<T> {
        return this.fetchOne(id.toString(), relations);
    }

    // endregion

    // region UPDATE

    public update(model: T, url = `${this.baseIri}/${model.id}`): Promise<T> {
        return new Promise((resolve, reject) => {
            axios.put(url, model)
                .then(({ data }: { data: T }) => {
                    resolve(data);
                })
                .catch(() => {
                    reject();
                });
        });
    }

    // endregion

    // region DELETE

    public delete(model: T): Promise<void> {
        return new Promise((resolve, reject) => {
            axios.delete(`${this.baseIri}/${model.id}`)
                .then(() => {
                    resolve();
                })
                .catch((e: AxiosError) => {
                    reject(e);
                });
        });
    }

    // endregion

    // region Protected methods

    protected fetchMany(
        url: string,
        relations?: R[],
        config?: AxiosRequestConfig,
    ): Promise<T[]> {
        if (relations) {
            config = this.addRelationsToAxiosRequestConfig(relations, config);
        }

        url = `${this.baseIri}${url ? `/${url}` : ''}`;

        return new Promise((resolve, reject) => {
            axios.get(url, config)
                .then(({ data }: { data: T[] }) => {
                    resolve(data);
                })
                .catch((error: AxiosError) => {
                    reject(error);
                });
        });
    }

    protected fetchOne(
        url: string,
        relations?: R[],
        config?: AxiosRequestConfig,
    ): Promise<T> {
        if (relations) {
            config = this.addRelationsToAxiosRequestConfig(relations, config);
        }

        url = `${this.baseIri}${url ? `/${url}` : ''}`;

        return new Promise((resolve, reject) => {
            axios.get(url, config)
                .then(({ data }: { data: T }) => {
                    resolve(data);
                })
                .catch((error: AxiosError) => {
                    reject(error);
                });
        });
    }

    // endregion

    // region Private methods

    private addRelationsToAxiosRequestConfig(
        relations: R[],
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

    // endregion
}
