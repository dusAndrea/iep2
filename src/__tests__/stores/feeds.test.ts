import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('@/services/newsApiServices', () => ({
  API_KEY: 'test-api-key',
  GREEN_URL: 'https://test-news-api.com/v2/everything',
}))

import { useFeedsStore } from '@/stores/feeds'

const mockFetch = (ok: boolean, data: unknown) =>
  vi.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 500,
    json: () => Promise.resolve(data),
  })

describe('useFeedsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  describe('getFeeds getter', () => {
    it('restituisce un array vuoto all\'inizializzazione', () => {
      const store = useFeedsStore()
      expect(store.getFeeds).toEqual([])
    })
  })

  describe('fetchFeeds', () => {
    it('salva gli articoli in caso di successo', async () => {
      const articles = [
        { title: 'Articolo 1', url: 'https://example.com/1' },
        { title: 'Articolo 2', url: 'https://example.com/2' },
      ]
      vi.spyOn(global, 'fetch').mockImplementation(mockFetch(true, { articles }))

      const store = useFeedsStore()
      await store.fetchFeeds()

      expect(store.feeds).toEqual(articles)
    })

    it('lancia un errore se la risposta HTTP non è ok', async () => {
      vi.spyOn(global, 'fetch').mockImplementation(mockFetch(false, {}))

      const store = useFeedsStore()
      await expect(store.fetchFeeds()).rejects.toThrow('Errore nel caricamento degli articoli')
    })

    it('lancia un errore in caso di errore di rete', async () => {
      vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'))

      const store = useFeedsStore()
      await expect(store.fetchFeeds()).rejects.toThrow('Errore nel caricamento degli articoli')
    })

    it('include i parametri corretti e la apiKey nella URL', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch').mockImplementation(mockFetch(true, { articles: [] }))

      const store = useFeedsStore()
      await store.fetchFeeds()

      const calledUrl = String(fetchSpy.mock.calls[0][0])
      expect(calledUrl).toContain('green')
      expect(calledUrl).toContain('test-api-key')
    })
  })

  describe('clearFeeds', () => {
    it('svuota l\'array di feeds', async () => {
      vi.spyOn(global, 'fetch').mockImplementation(mockFetch(true, { articles: [{ title: 'A' }] }))

      const store = useFeedsStore()
      await store.fetchFeeds()
      expect(store.feeds.length).toBe(1)

      store.clearFeeds()
      expect(store.feeds).toEqual([])
    })
  })
})
