import { describe, it, expect } from 'vitest'
import { useFirebaseAuthError } from '@/composables/useFirebaseAuthError'

describe('useFirebaseAuthError', () => {
  const { getFirebaseAuthErrorMessage } = useFirebaseAuthError()

  it('restituisce messaggio per email non valida', () => {
    expect(getFirebaseAuthErrorMessage('auth/invalid-email')).toContain('email')
  })

  it('restituisce messaggio per email già in uso', () => {
    expect(getFirebaseAuthErrorMessage('auth/email-already-in-use')).toContain('registrat')
  })

  it('restituisce messaggio per credenziali errate (user-not-found)', () => {
    expect(getFirebaseAuthErrorMessage('auth/user-not-found')).toContain('password')
  })

  it('restituisce lo stesso messaggio per wrong-password e user-not-found', () => {
    expect(getFirebaseAuthErrorMessage('auth/wrong-password')).toBe(
      getFirebaseAuthErrorMessage('auth/user-not-found')
    )
  })

  it('restituisce messaggio per account disabilitato', () => {
    expect(getFirebaseAuthErrorMessage('auth/user-disabled')).toContain('disabilitato')
  })

  it('restituisce messaggio per troppi tentativi', () => {
    expect(getFirebaseAuthErrorMessage('auth/too-many-requests')).toContain('tentativi')
  })

  it('restituisce messaggio per password debole', () => {
    expect(getFirebaseAuthErrorMessage('auth/weak-password')).toContain('6')
  })

  it('restituisce messaggio di default per codice sconosciuto', () => {
    const defaultMsg = getFirebaseAuthErrorMessage('codice/inesistente')
    expect(defaultMsg).toBeTypeOf('string')
    expect(defaultMsg.length).toBeGreaterThan(0)
  })

  it('restituisce una stringa per tutti i codici noti', () => {
    const codiNoti = [
      'auth/invalid-email',
      'auth/email-already-in-use',
      'auth/user-not-found',
      'auth/invalid-credential',
      'auth/wrong-password',
      'auth/user-disabled',
      'auth/too-many-requests',
      'auth/weak-password',
      'auth/missing-password',
      'auth/missing-email',
      'auth/popup-closed-by-user',
      'auth/network-request-failed',
      'auth/internal-error',
      'auth/operation-not-allowed',
      'auth/invalid-verification-code',
      'auth/requires-recent-login',
    ]

    codiNoti.forEach(codice => {
      expect(getFirebaseAuthErrorMessage(codice)).toBeTypeOf('string')
    })
  })
})
