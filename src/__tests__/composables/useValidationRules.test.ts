import { describe, it, expect } from 'vitest'
import { useValidationRules } from '@/composables/useValidationRules'

describe('useValidationRules', () => {
  const { emailRule, requiredRule, matchRule, minLength } = useValidationRules()

  describe('emailRule', () => {
    it('accetta un indirizzo email valido', () => {
      expect(emailRule('utente@esempio.com')).toBe(true)
    })

    it('accetta email con sottodominio', () => {
      expect(emailRule('utente@mail.esempio.it')).toBe(true)
    })

    it('rifiuta un indirizzo senza @', () => {
      expect(emailRule('utenteesempio.com')).toBeTypeOf('string')
    })

    it('rifiuta un indirizzo senza dominio', () => {
      expect(emailRule('utente@')).toBeTypeOf('string')
    })

    it('rifiuta una stringa vuota', () => {
      expect(emailRule('')).toBeTypeOf('string')
    })
  })

  describe('requiredRule', () => {
    it('accetta una stringa non vuota', () => {
      expect(requiredRule('valore')).toBe(true)
    })

    it('rifiuta una stringa vuota', () => {
      expect(requiredRule('')).toBeTypeOf('string')
    })

    it('rifiuta una stringa di soli spazi', () => {
      expect(requiredRule('   ')).toBeTypeOf('string')
    })
  })

  describe('matchRule', () => {
    it('accetta quando i valori coincidono', () => {
      expect(matchRule('password123')('password123')).toBe(true)
    })

    it('rifiuta quando i valori non coincidono', () => {
      expect(matchRule('password123')('diversa')).toBeTypeOf('string')
    })

    it('rifiuta quando uno dei due è vuoto', () => {
      expect(matchRule('password123')('')).toBeTypeOf('string')
    })
  })

  describe('minLength', () => {
    it('accetta una stringa di 6 caratteri', () => {
      expect(minLength('123456')).toBe(true)
    })

    it('accetta una stringa più lunga di 6 caratteri', () => {
      expect(minLength('passwordlunga')).toBe(true)
    })

    it('rifiuta una stringa di 5 caratteri', () => {
      expect(minLength('12345')).toBeTypeOf('string')
    })

    it('rifiuta una stringa vuota', () => {
      expect(minLength('')).toBeTypeOf('string')
    })
  })
})
