import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import type { Price } from '~/types'

dayjs.locale('ru')

const MONTHS_SHORT = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']

export function formatShortDate(value: string): string {
  const d = dayjs(value)
  return `${d.format('DD')} / ${d.format('MM')}`
}

export function formatLongDate(value: string): string {
  const d = dayjs(value)
  return `${d.format('DD')} / ${MONTHS_SHORT[d.month()]} / ${d.format('YYYY')}`
}

export function formatAmount(value: number): string {
  return value.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function sumByCurrency(prices: Price[][], symbol: Price['symbol']): number {
  return prices.reduce((total, list) => {
    const entry = list.find((price) => price.symbol === symbol)
    return total + (entry?.value ?? 0)
  }, 0)
}
