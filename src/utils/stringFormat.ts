export const stringToBoolean = (booleanString: string) => {
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
};

export const getIdFromIRI = (iri: string): number => parseInt(iri.substring(iri.lastIndexOf('/') + 1), 10);
