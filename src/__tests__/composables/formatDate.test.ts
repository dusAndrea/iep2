import { describe, it, expect } from 'vitest'
import { formatDate } from '@/composables/useFormatDate'

describe('formatDate', () => {
  it('formatta una data ISO in formato italiano', () => {
    const result = formatDate('2024-06-15T00:00:00.000Z')
    expect(result).toContain('2024')
    expect(result).toMatch(/giugno|15/i)
  })

  it('produce una stringa non vuota', () => {
    expect(formatDate('2023-01-01T00:00:00.000Z').length).toBeGreaterThan(0)
  })

  it('include il giorno, mese e anno', () => {
    const result = formatDate('2024-03-20T00:00:00.000Z')
    expect(result).toContain('2024')
    expect(result).toMatch(/marzo|20/i)
  })

  it('gestisce il primo giorno dell\'anno', () => {
    const result = formatDate('2024-01-01T00:00:00.000Z')
    expect(result).toContain('2024')
    expect(result).toMatch(/gennaio/i)
  })
})
