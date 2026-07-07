import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useFeedsStore } from '@/stores';
import { useMessagesStore } from '@/stores';
import type { FeedType } from '@/types';

export function useFeedLoader() {
  const feedStore = useFeedsStore();
  const messagesStore = useMessagesStore();
  const { getFeeds } = storeToRefs(feedStore);
  const feeds = ref<FeedType[]>([]);

  async function loadFeeds() {
    if (!getFeeds.value.length) {
      try {
        await feedStore.fetchFeeds();
      } catch (error: unknown) {
        messagesStore.showMessage(
          error instanceof Error ? error.message : 'Errore sconosciuto',
          'error'
        );
      }
    }
    feeds.value = getFeeds.value;
  }

  onMounted(loadFeeds);

  return { feeds };
}
