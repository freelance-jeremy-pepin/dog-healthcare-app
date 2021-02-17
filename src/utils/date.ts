import moment from 'moment';

export default class Date {
    static databaseFormatRegex = /([0-9]{4}|[0-9]{2})[-]([0]?[1-9]|[1][0-2])[-]([0]?[1-9]|[1|2][0-9]|[3][0|1])/;

    static appFormatRegex = /([0]?[1-9]|[1|2][0-9]|[3][0|1])[/]([0]?[1-9]|[1][0-2])[/]([0-9]{4}|[0-9]{2})/;

    static databaseFormat = 'YYYY-MM-DD';

    static appFormat = 'DD/MM/YYYY';

    public static databaseToApp(date: string): string {
        return moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
    }

    public static appToDatabase(date: string): string {
        return moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    }
}
