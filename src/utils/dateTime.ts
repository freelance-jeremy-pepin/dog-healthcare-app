import moment from 'moment';

export default class DateTime {
    static databaseFormatRegex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

    static appFormatRegex = /([0]?[1-9]|[1|2][0-9]|[3][0|1])[/]([0]?[1-9]|[1][0-2])[/]([0-9]{4}|[0-9]{2}) (?:2[0-3]|[01]?[0-9]):[0-5][0-9]:[0-5][0-9]/;

    static databaseFormat = 'YYYY-MM-DD HH:mm:ss';

    static appFormat = 'DD/MM/YYYY HH:mm:ss';

    public static databaseToApp(date: string): string {
        return moment(date, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm:ss');
    }

    public static appToDatabase(date: string): string {
        return moment(date, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    }
}
