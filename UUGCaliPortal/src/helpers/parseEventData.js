export // Helper para parsear la fecha "DD MMM" o "DD MMM YYYY" (ej: "15 AGO 2026") a un objeto Date
const parseEventDate = (dateStr) => {
  if (!dateStr) return null;
  const MONTHS_ES = {
    ENE: 0, FEB: 1, MAR: 2, ABR: 3, MAY: 4, JUN: 5,
    JUL: 6, AGO: 7, SEP: 8, OCT: 9, NOV: 10, DIC: 11
  };
  
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length < 2) return null;

  const day = parseInt(parts[0], 10);
  const monthKey = parts[1].toUpperCase();
  const month = MONTHS_ES[monthKey];

  if (isNaN(day) || month === undefined) return null;

  const now = new Date();
  
  // Si incluye año de 4 dígitos (2026) o 2 dígitos (26), lo parsea; si no, toma el año actual
  let year = now.getFullYear();
  if (parts[2]) {
    const parsedYear = parseInt(parts[2], 10);
    if (!isNaN(parsedYear)) {
      year = parsedYear < 100 ? 2000 + parsedYear : parsedYear;
    }
  }

  return new Date(year, month, day);
};