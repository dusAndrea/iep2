<template>
  <v-app :full-height="true">
    <LayoutSnackbar />

    <HeaderBar />

    <v-main :scrollable="true">
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
