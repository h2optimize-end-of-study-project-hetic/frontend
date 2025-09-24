export const countryToISO: Record<string, string> = {
  France: "FR",
  Allemagne: "DE",
  Espagne: "ES",
  Italie: "IT",
};

export function getCountryISO(country: string): string {
  return countryToISO[country] || country;
}
