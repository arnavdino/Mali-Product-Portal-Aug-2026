export interface FormField {
  value: string,
  mandatory: boolean,
  validation: Validation
}
export enum Validation {
  INVALID = "invalid",
  VALID = ""
}
export const isValid = <Type>(fields: { [key in keyof Type]: FormField }, exclude?: keyof Type) => {
  var hasError = false;
  Object.entries(fields as { [key: string]: FormField }).map(([key, field]) => {
    if ((field.value == "" && field.mandatory && key != exclude) || field.validation === Validation.INVALID) {
      field.validation = Validation.INVALID;
      hasError = true;
    }

  });
  return !hasError;
}

export const generateFields = <Type>(fields: (keyof Type)[]): { [key in keyof Type]: FormField } => {
  let newFields: { [key in keyof Type]: FormField } = {} as any;
  fields.forEach((name) => { newFields[name] = { value: "", validation: Validation.VALID, mandatory: true } });
  return newFields;
}