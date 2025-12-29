export function formatDate(isoDate: string): string {

  const date = new Date(isoDate);

  return date.toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
