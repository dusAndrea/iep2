<template>

  <Carousel v-if="feeds.length"
    class="gaia-carousel"
    v-bind="carouselConfig">
    <Slide v-for="(feed, index) in feeds"
      :key="index">
      <FeedArticles :key="index"
        :article="feed" />
    </Slide>
    <template #addons>
      <Navigation />
    </template>
  </Carousel>

</template>

<script setup lang="ts">
  import 'vue3-carousel/carousel.css';
  import { Carousel, Slide, Navigation } from 'vue3-carousel';
  import { FeedArticles } from '@/components';
  import { useFeedLoader } from '@/composables/useFeedLoader';

  const { feeds } = useFeedLoader();

  const carouselConfig = {
    itemsToShow: 4,
    wrapAround: false,
    snapAlign: 'start' as const,
    gap: 20,
    height: 160
  };
</script>
