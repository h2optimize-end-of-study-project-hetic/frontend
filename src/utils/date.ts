/**
 * Convertit une date en format compatible input[type="date"]
 */
export function formatDateForInput(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().split("T")[0]; // "2025-08-29"
}

/**
 * Convertit une date en format local FR
 */
// export function formatDateForDisplay(date: Date | string): string {
//   const d = typeof date === "string" ? new Date(date) : date;
//   return d.toLocaleDateString("fr-FR"); // "29/08/2025"
// }
