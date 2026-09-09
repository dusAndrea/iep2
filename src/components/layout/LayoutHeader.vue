<template>
  <v-app-bar v-if="isLoggedIn"
    app
    height="140"
    color="background"
    flat
    class="px-4">

    <v-app-bar-nav-icon
      :aria-label="drawer ? 'Chiudi menu di navigazione' : 'Apri menu di navigazione'"
      :aria-expanded="drawer"
      aria-controls="nav-drawer"
      @click="drawer = !drawer"
      class="d-md-none" />

    <v-spacer class="d-block d-lg-none" />

    <RouterLink to="/" aria-label="Vai alla homepage">
      <v-img :width="140"
        aspect-ratio="16/9"
        cover
        alt=""
        :src="imgPath" />
    </RouterLink>

    <v-spacer />

    <!-- Desktop Links -->
    <div class="d-none d-md-flex mx-auto">
      <v-btn v-for="link in links"
        :key="link.to"
        :to="link.to"
        router
        exact
        class="mx-2 text-h5"
        :class="{ 'active-link': route.path === link.to }"
        variant="text">
        <v-icon start
          :color="link.color">{{ link.icon }}</v-icon>
        {{ link.text }}
      </v-btn>
    </div>

    <v-spacer class="d-none d-lg-block" />

    <!-- Desktop Toggle Theme -->
    <DesktopToggle />

    <v-divider inset
      length="60px"
      class="mx-4 my-auto d-none d-lg-flex"
      vertical></v-divider>

    <v-icon-btn class="d-none d-lg-flex"
      icon="mdi-logout"
      size="large"
      variant="text"
      aria-label="Esci dall'account"
      @click="logout" />

    <v-menu min-width="200px">
      <template v-slot:activator="{ props }">
        <v-btn icon
          :aria-label="`Apri menu utente di ${getDisplayName}`"
          v-bind="props">
          <v-avatar color="text"
            size="large"
            aria-hidden="true">
            <span class="text-h6">{{ getShortDisplayName }}</span>
          </v-avatar>
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <div class="mx-auto text-center">
            <v-avatar color="text">
              <span class="text-h5">{{ getShortDisplayName }}</span>
            </v-avatar>
            <h3>{{ getDisplayName }}</h3>
            <p class="text-caption mt-1">
              {{ getEmail }}
            </p>
            <v-divider class="my-3"></v-divider>
            <v-btn variant="text"
              rounded
              :to="{ name: 'Profile' }">
              Modifica Profilo
            </v-btn>
            <v-divider class="my-3"></v-divider>
            <v-btn variant="text"
              rounded
              @click="logout">
              Logout
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-menu>
  </v-app-bar>

  <!-- Drawer for mobile -->
  <v-navigation-drawer v-model="drawer"
    id="nav-drawer"
    app
    temporary
    aria-label="Menu di navigazione principale">
    <v-list>
      <v-list-item v-for="link in links"
        :key="link.to"
        :to="link.to"
        router
        exact
        :class="{ 'active-link': route.path === link.to }">
        <template #prepend>
          <v-icon :style="{ color: link.color }">{{ link.icon }}</v-icon>
        </template>
        <v-list-item-title>
          {{ link.text }}
        </v-list-item-title>
      </v-list-item>

      <v-divider />

      <v-list-item @click="logout">
        <template #prepend><v-icon-btn icon="mdi-logout"
            variant="text" /></template>
        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <MobileToggle />
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import lightLogo from '@/assets/logo_nobg_light.png';
  import darkLogo from '@/assets/logo_nobg_dark.png';
  import { useUserStore, useFeedsStore } from '@/stores';
  import { storeToRefs } from 'pinia';
  import { useRouter, useRoute } from 'vue-router';
  import DesktopToggle from '@/components/responsive/ResponsiveDesktop.vue';
  import MobileToggle from '@/components/responsive/ResponsiveMobile.vue';
  import { useIsDark } from '@/composables/useIsDark';
  // COMPOSABLE THEME
  const { isDark } = useIsDark();

  // STORE
  const userStore = useUserStore();
  const { isLoggedIn } = storeToRefs(userStore);
  const feedsStore = useFeedsStore();
  const { getDisplayName, getEmail, getShortDisplayName } = storeToRefs(userStore);

  // ROUTER
  const router = useRouter();
  const route = useRoute();

  // STATE
  const drawer = ref(false);

  // COMPUTED
  const links = computed(() => [
    {
      to: '/dashboard',
      text: 'Dashboard',
      icon: 'mdi-view-dashboard-outline',
      color: isDark.value ? 'accent' : 'text',
    },
    {
      to: '/wall',
      text: 'Wall',
      icon: 'mdi-newspaper-variant-outline',
      color: isDark.value ? 'accent' : 'text',
    },
    {
      to:
        '/assessment',
      text: 'Assessment',
      icon: 'mdi-help-circle-outline',
      color: isDark.value ? 'accent' : 'text',
    },
    {
      to: '/profile',
      text: 'Profile',
      icon: 'mdi-account-circle-outline',
      color: isDark.value ? 'accent' : 'text',
    },
    {
      to: '/about',
      text: 'About',
      icon: 'mdi-information-outline',
      color: isDark.value ? 'primary' : 'text',
    },
  ]);

  const imgPath = computed(() => isDark.value ? darkLogo : lightLogo);

  const logout = async () => {
    try {
      await userStore.logout();
    } catch {
      // signOut fallito (es. rete): lo store è già stato resettato,
      // la sessione locale è chiusa comunque.
    }
    feedsStore.clearFeeds();
    router.push({ name: 'login' });
  };
</script>
<style lang="scss" scoped>
  .v-app-bar {
    transition: background-color 0.3s ease;
  }

  .nav-link {
    text-decoration: none;

    &.active-link {
      font-weight: bold;
      border-bottom: 2px solid white;
    }
  }

  .active-link {
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 8px;
  }

  .v-btn:hover .v-icon,
  .v-list-item:hover .v-icon {
    filter: brightness(1.2);
    transform: scale(1.05);
    transition: all 0.2s ease;
  }
</style>
