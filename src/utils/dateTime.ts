import moment from 'moment';

export default class DateTime {
    static databaseFormat = 'YYYY-MM-DD HH:mm:ss';

    static appFormat = 'DD/MM/YYYY HH:mm:ss';

    public static databaseToApp(date: string): string {
        return moment(date, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm:ss');
    }

    public static appToDatabase(date: string): string {
        return moment(date, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    }
}
