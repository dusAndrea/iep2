<template>
  <v-card v-if="article"
    class="d-flex"
    elevation="1"
    rounded="0">
    <v-avatar rounded="0"
      size="160">
      <v-img :src="article.urlToImage || 'https://placehold.co/600x400?text=No+Image'"
        alt="Article cover"
        cover>
        <template #placeholder>
          <v-skeleton-loader type="image"></v-skeleton-loader>
        </template>
      </v-img>
    </v-avatar>
    <div class="d-flex flex-column justify-space-between pa-3">
      <h6 class="text-body-1">
        <a class="text-text"
          target="_blank"
          rel="noopener noreferrer"
          :href="article.url">
          {{ article.title }}
        </a>
      </h6>

      <div class="d-flex flex-column align-end text-text text-body-2">
        <p class="font-weight-medium text-wrap">{{ article.author || 'Autore sconosciuto' }}</p>
        <p>{{ formattedDate }}</p>
      </div>
    </div>
  </v-card>

  <v-card v-else
    color="background"
    flat>
    <div class="d-flex align-center">
      <v-avatar class="ma-3"
        rounded="0"
        size="80">
        <v-img cover
          aspect-ratio="16/9"
          src="https://placehold.co/600x400?text=Oh+No"
          alt="Placeholder image"
          tile />
      </v-avatar>

      <div class="d-flex flex-column">
        <h6 class="text-subtitle-2 font-weight-bold">Nessuna news</h6>
      </div>
    </div>
  </v-card>
</template>
<script setup lang="ts">
  import { computed } from 'vue';
  import type { FeedType } from '@/types';

  const props = defineProps<{
    article?: FeedType | null,
  }>();

  const formattedDate = computed(() => {
    const date = props.article?.publishedAt;

    return date ? new Date(date).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }) : '';
  });
</script>
<style lang="scss" scoped>
.v-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.2s ease;
}
</style>
