export function useValidationRules() {
  const emailRule = (value: string): true | string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || 'Inserisci un indirizzo email valido';
  };

  const requiredRule = (value: string): true | string => {
    return !!value?.trim() || 'Questo campo è obbligatorio';
  };

  const matchRule = (otherValue: string) => {
    return (value: string): true | string => {
      return value === otherValue || 'I valori non coincidono.';
    };
  };

  const minLength = (value: string) => {
    return value.length >= 6 || 'Minimo 6 caratteri ';
  };

  return {
    emailRule,
    requiredRule,
    matchRule,
    minLength
  };
}
