import dayjs from 'dayjs'
import type { Price } from '~/types'

const MONTHS: Record<string, string[]> = {
  ru: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
}

const AMOUNT_LOCALE: Record<string, string> = {
  ru: 'ru-RU',
  en: 'en-US',
}

export function formatShortDate(value: string): string {
  const d = dayjs(value)
  return `${d.format('DD')} / ${d.format('MM')}`
}

export function formatLongDate(value: string, locale = 'ru'): string {
  const d = dayjs(value)
  const months = MONTHS[locale] ?? MONTHS.ru!
  return `${d.format('DD')} / ${months[d.month()]} / ${d.format('YYYY')}`
}

export function formatAmount(value: number, locale = 'ru'): string {
  return value.toLocaleString(AMOUNT_LOCALE[locale] ?? 'ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function priceBySymbol(prices: Price[], symbol: Price['symbol']): number | null {
  return prices.find((price) => price.symbol === symbol)?.value ?? null
}

export function sumByCurrency(prices: Price[][], symbol: Price['symbol']): number {
  return prices.reduce((total, list) => total + (priceBySymbol(list, symbol) ?? 0), 0)
}
