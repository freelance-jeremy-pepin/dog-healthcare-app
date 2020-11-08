export interface DisplayModeInterface {
    key: 'chart' | 'table' | 'history' | 'summary';
    icon: string;
    label: string;
}

export default class DisplayMode {
    private readonly localStorageKey: string;

    private readonly displayModes: DisplayModeInterface[];

    private currentDisplayMode: DisplayModeInterface;

    constructor(displayModes: DisplayModeInterface[], localStorageKey: string) {
        this.displayModes = displayModes;
        this.localStorageKey = localStorageKey;
        // eslint-disable-next-line prefer-destructuring
        this.currentDisplayMode = this.displayModes[0];
    }

    public get NextDisplayMode(): DisplayModeInterface {
        const indexCurrentDisplayMode = this.displayModes.findIndex(
            (value) => value.key === this.currentDisplayMode.key,
        );

        if (indexCurrentDisplayMode >= this.displayModes.length - 1) {
            return this.displayModes[0];
        }

        return this.displayModes[indexCurrentDisplayMode + 1];
    }

    public get CurrentDisplayMode(): DisplayModeInterface {
        return this.currentDisplayMode;
    }

    public restore() {
        // eslint-disable-next-line max-len
        const displayModeLocalStorage: string | null = window.localStorage.getItem(this.localStorageKey);
        if (displayModeLocalStorage) {
            this.currentDisplayMode = JSON.parse(displayModeLocalStorage);
        }
    }

    public next() {
        this.currentDisplayMode = this.NextDisplayMode;
        window.localStorage.setItem(this.localStorageKey, JSON.stringify(this.currentDisplayMode));
    }
}
