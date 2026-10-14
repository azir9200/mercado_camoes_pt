export function formatCurrency(amount: number, locale = 'pt-PT'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}

export function formatDate(dateString: string, locale = 'pt-PT'): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(dateString));
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
