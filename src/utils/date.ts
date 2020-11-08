import moment from 'moment';

export default class Date {
    static databaseFormat = 'YYYY-MM-DD';

    static appFormat = 'DD/MM/YYYY';

    public static databaseToApp(date: string): string {
        return moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
    }

    public static appToDatabase(date: string): string {
        return moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    }
}
