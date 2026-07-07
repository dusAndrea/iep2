<template>
  <v-app :full-height="true">
    <a href="#main-content" class="skip-link">Vai al contenuto principale</a>

    <LayoutSnackbar />

    <HeaderBar />

    <v-main id="main-content" :scrollable="true">
      <v-container fluid>
        <v-row>
          <v-col cols="12"
            offset="0"
            md="10"
            offset-md="1"
            lg="8"
            offset-lg="2">
            <RouterView />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <FooterBar />
  </v-app>
</template>
<script setup lang="ts">
  import { RouterView } from 'vue-router';
  import { LayoutHeader as HeaderBar, LayoutFooter as FooterBar, LayoutSnackbar } from '@/components';
</script>

<style scoped>
.skip-link {
  position: absolute;
  left: -9999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
  z-index: -999;
}

.skip-link:focus {
  position: fixed;
  top: 0;
  left: 0;
  width: auto;
  height: auto;
  padding: 8px 16px;
  background: #000;
  color: #fff;
  font-size: 1rem;
  z-index: 9999;
  text-decoration: none;
  border-radius: 0 0 4px 0;
}
</style>
