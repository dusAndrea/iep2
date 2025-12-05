import { defineStore } from 'pinia';
import type { FeedType } from '@/types';
import { API_KEY, GREEN_URL } from '@/services/newsApiServices';

export const useFeedsStore = defineStore('feeds', {
  state: () => ({
    feeds: [] as Array<FeedType>,
  }),
  persist: true,
  getters: {
    getFeeds: (state) => state.feeds
  },
  actions: {
    async fetchFeeds() {

      try {
        const params = new URLSearchParams({
          q: 'green sustainability climate innovation',
          language: 'en',
          sortBy: 'relevancy',
          pageSize: '10',
          apiKey: API_KEY
        });

        const res = await fetch(`${GREEN_URL}?${params.toString()}`);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        this.feeds = data.articles;
      } catch (err: any) {
        throw new Error('Errore nel caricamento degli articoli');
      }
    },

    clearFeeds() {
      this.feeds = [];
    },
  }
});
