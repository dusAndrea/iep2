<template>
  <v-row>
    <v-col cols="12">
      <h1 class="text-text">Le ultime dal mondo</h1>
    </v-col>

    <v-col v-for="(feed, index) in feeds"
      :key="index"
      cols="12"
      md="6"
      lg="4">
      <v-card>
        <v-img class="align-end text-white opacity-4"
          :src="feed.urlToImage"
          cover
          aspect-ratio="16/9">
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular color="grey-lighten-4"
                indeterminate></v-progress-circular>
            </div>
          </template>
          <v-card-title>
            <a :href="feed.url"
              target="_blank"
              class="text-white text-decoration-none gaia-opacity">{{ feed.title }}</a></v-card-title>
        </v-img>

        <v-card-subtitle class="pt-4">
          {{ feed.description }}
        </v-card-subtitle>

        <v-card-text>
          {{ feed.content }}
        </v-card-text>

        <v-card-text class="d-flex justify-space-between ga-5">

          <div class="d-flex flex-column text-truncate">
            <strong class="text-truncate">{{ feed.author }}</strong>

            <span class="text-medium-emphasis">{{ formatDate(feed.publishedAt.toString()) }}</span>
          </div>
          <v-btn :border="true"
            primary
            :href="feed.url">Leggi</v-btn>
        </v-card-text>
      </v-card>

    </v-col>
  </v-row>

</template>
<script setup lang="ts">
  import { formatDate } from '@/composables';
  import { useFeedLoader } from '@/composables/useFeedLoader';

  const { feeds } = useFeedLoader();
</script>
