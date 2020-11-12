import { AxiosError } from 'axios';

export enum PageState {
    idle = 'idle',
    loading = 'loading',
    ready = 'ready',
    error = 'error',
    unknown = 'unknown',
}

export default class Page<Loadings> {
    private _state: PageState;

    private _errorMessage: string;

    private _loadings!: Loadings;

    constructor(loadings: Loadings) {
        this._state = PageState.idle;
        this._errorMessage = '';
        this.loadings = loadings;
    }

    public processError(error: AxiosError | Error) {
        this.state = PageState.error;

        if (`response` in error && error.response?.data.message) {
            this.errorMessage = error.response.data.message;
        } else if (error.message) {
            this.errorMessage = error.message;
        } else {
            this.errorMessage = `Une erreur s'est produite.`;
        }
    }

    public get state(): PageState {
        return this._state;
    }

    public set state(state: PageState) {
        this._state = state;
    }

    public get errorMessage(): string {
        return this._errorMessage;
    }

    public set errorMessage(errorMessage: string) {
        this._errorMessage = errorMessage;
    }

    public get loadings(): Loadings {
        return this._loadings;
    }

    public set loadings(loadings: Loadings) {
        this._loadings = loadings;

        if (this._state === PageState.loading && Object.values(this._loadings).every((value) => !value)) {
            this._state = PageState.ready;
        }
    }
}
