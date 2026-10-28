import { formatAmount, formatLongDate, formatShortDate } from '~/utils/format'

export function useLocaleFormat() {
  const { locale } = useI18n()

  return {
    shortDate: (value: string) => formatShortDate(value),
    longDate: (value: string) => formatLongDate(value, locale.value),
    amount: (value: number) => formatAmount(value, locale.value),
  }
}
