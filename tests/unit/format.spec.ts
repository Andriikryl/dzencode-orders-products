import { describe, expect, it } from 'vitest'
import { formatAmount, formatLongDate, formatShortDate, sumByCurrency } from '../../app/utils/format'
import type { Price } from '../../app/types'

describe('formatShortDate', () => {
  it('returns day and month separated by a slash', () => {
    expect(formatShortDate('2017-06-29 12:09:33')).toBe('29 / 06')
  })

  it('pads single digit days and months', () => {
    expect(formatShortDate('2017-01-05 00:00:00')).toBe('05 / 01')
  })
})

describe('formatLongDate', () => {
  it('uses short Russian month names by default', () => {
    expect(formatLongDate('2017-04-06 12:09:33')).toBe('06 / Апр / 2017')
  })

  it('switches month names with the locale', () => {
    expect(formatLongDate('2017-04-06 12:09:33', 'en')).toBe('06 / Apr / 2017')
  })

  it('falls back to Russian for an unknown locale', () => {
    expect(formatLongDate('2017-04-06 12:09:33', 'de')).toBe('06 / Апр / 2017')
  })
})

describe('formatAmount', () => {
  it('keeps two decimals', () => {
    expect(formatAmount(50, 'en')).toBe('50.00')
  })

  it('groups thousands', () => {
    expect(formatAmount(250000.5, 'en')).toBe('250,000.50')
  })
})

describe('sumByCurrency', () => {
  const prices: Price[][] = [
    [
      { value: 100, symbol: 'USD', isDefault: 0 },
      { value: 2600, symbol: 'UAH', isDefault: 1 },
    ],
    [
      { value: 50, symbol: 'USD', isDefault: 0 },
      { value: 1300, symbol: 'UAH', isDefault: 1 },
    ],
  ]

  it('sums the requested currency only', () => {
    expect(sumByCurrency(prices, 'USD')).toBe(150)
    expect(sumByCurrency(prices, 'UAH')).toBe(3900)
  })

  it('treats a missing currency as zero', () => {
    expect(sumByCurrency([[{ value: 10, symbol: 'USD', isDefault: 1 }]], 'UAH')).toBe(0)
  })

  it('returns zero for an empty list', () => {
    expect(sumByCurrency([], 'USD')).toBe(0)
  })
})
