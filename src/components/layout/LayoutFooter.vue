<template>
  <v-footer v-if="isLoggedIn"
    color="primary"
    class="text-center d-flex flex-column p-1"
    app>
    <v-img :width="60"
      aspect-ratio="1"
      cover
      :src="logo" />
  </v-footer>
</template>

<script setup lang="ts">
  import logo from '@/assets/logo_footer.png';
  import { useUserStore } from '@/stores';
  import { storeToRefs } from 'pinia';

  const userStore = useUserStore();
  const { isLoggedIn } = storeToRefs(userStore);
</script>
