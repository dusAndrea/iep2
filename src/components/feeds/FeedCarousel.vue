<template>

  <Carousel v-if="feeds.length"
    class="gaia-carousel"
    v-bind="carouselConfig">
    <Slide v-for="(feed, index) in feeds"
      :key="index">
      <GaiaFeedArticle :key="index"
        :article="feed" />
    </Slide>
    <template #addons>
      <Navigation />
    </template>
  </Carousel>

</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import 'vue3-carousel/carousel.css';
  import { Carousel, Slide, Navigation } from 'vue3-carousel';
  import { FeedArticles } from '@/components';
  import { useFeedsStore } from '@/stores';
  import { storeToRefs } from 'pinia';
  import type { FeedType } from '@/types';
  import { useMessagesStore } from '@/stores';

  export default defineComponent({
    name: 'GreenFeed',
    components: {
      Carousel, Slide, Navigation,
      FeedArticles,

    },
    setup() {
      const feedStore = useFeedsStore();
      const feeds = ref([] as FeedType[]);
      const { getFeeds } = storeToRefs(feedStore);
      const messagesStore = useMessagesStore();
      const carouselConfig = {
        itemsToShow: 4,
        wrapAround: false,
        snapAlign: 'start',
        gap: 20,
        height: 160
      };

      const fetchFeeds = async () => {
        if (!getFeeds.value.length) {
          try {
            await feedStore.fetchFeeds();
          } catch (error: any) {
            messagesStore.showMessage(error.message, 'error');
          }
        }
        feeds.value = getFeeds.value;
      };

      onMounted(() => {
        fetchFeeds();
      });

      return {
        fetchFeeds,
        feeds,
        carouselConfig
      };
    }

  });
</script>
<style lang="scss" scoped>
.gaia-carousel {
  // background-color: rgb(var(--v-theme-secondary));
  //border-top: 1px solid rgb(var(--v-theme-secondary));
  //border-bottom: 1px solid rgb(var(--v-theme-secondary));
}
</style>
