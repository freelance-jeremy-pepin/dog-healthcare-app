export function stringToBoolean(booleanString: string): boolean {
    switch (booleanString.toLowerCase().trim()) {
        case 'true':
        case 'yes':
        case '1':
            return true;
        case 'false':
        case 'no':
        case '0':
        case null:
            return false;
        default:
            return Boolean(booleanString);
    }
}
