import { describe, it, expect, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { nextTick } from 'vue'
import LayoutSnackbar from '@/components/layout/LayoutSnackbar.vue'
import { useMessagesStore } from '@/stores/messages'

// Stub che renderizza anche i named slot così da includere il bottone "Chiudi"
const VSnackbarStub = {
  inheritAttrs: false,
  template: `<div v-bind="$attrs"><slot /><slot name="actions" /></div>`,
}

const mountSnackbar = () =>
  shallowMount(LayoutSnackbar, {
    global: {
      stubs: { VSnackbar: VSnackbarStub },
    },
  })

describe('LayoutSnackbar', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('attributi aria per tipo di messaggio', () => {
    it('usa role="alert" e aria-live="assertive" per gli errori', async () => {
      const wrapper = mountSnackbar()
      const store = useMessagesStore()
      store.showMessage('Qualcosa è andato storto', 'error')
      await nextTick()

      const root = wrapper.find('div')
      expect(root.attributes('role')).toBe('alert')
      expect(root.attributes('aria-live')).toBe('assertive')
    })

    it('usa role="status" e aria-live="polite" per i messaggi di successo', async () => {
      const wrapper = mountSnackbar()
      const store = useMessagesStore()
      store.showMessage('Operazione completata', 'success')
      await nextTick()

      const root = wrapper.find('div')
      expect(root.attributes('role')).toBe('status')
      expect(root.attributes('aria-live')).toBe('polite')
    })

    it('usa role="status" e aria-live="polite" per i messaggi info', async () => {
      const wrapper = mountSnackbar()
      const store = useMessagesStore()
      store.showMessage('Informazione generica', 'info')
      await nextTick()

      const root = wrapper.find('div')
      expect(root.attributes('role')).toBe('status')
      expect(root.attributes('aria-live')).toBe('polite')
    })
  })

  describe('bottone chiudi', () => {
    it('ha aria-label="Chiudi notifica"', () => {
      const wrapper = mountSnackbar()
      const closeBtn = wrapper.find('[aria-label="Chiudi notifica"]')
      expect(closeBtn.exists()).toBe(true)
    })

    it('chiama store.close al click', async () => {
      const wrapper = mountSnackbar()
      const store = useMessagesStore()
      store.showMessage('Messaggio', 'info')
      await nextTick()

      await wrapper.find('[aria-label="Chiudi notifica"]').trigger('click')
      expect(store.show).toBe(false)
    })
  })
})
