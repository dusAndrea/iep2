<template>
  <v-card color="background"
    :border="false"
    :flat="true">
    <v-card-title>
      <v-row align-content="center"
        justify="center">
        <v-col align-self="center"
          cols="4">
          <v-img aspect-ratio="16/9"
            cover
            :src="imgPath"
            alt="Logo Gaia Data"
            class="mx-auto" />
        </v-col>
      </v-row>
      <v-row class="my-3">
        <v-col>
          <h1 class="text-h3 text-text">Benvenuto</h1>
        </v-col>
      </v-row>
    </v-card-title>

    <v-spacer />

    <v-card-subtitle>Non hai un account? <RouterLink :to="{ name: 'register' }">Registrati</RouterLink></v-card-subtitle>

    <v-card-text>
      <v-form @submit.prevent="handleLogin"
        v-model="formIsValid">
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="email"
              label="Email"
              type="email"
              required
              variant="outlined"
              clearable
              :rules="[requiredRule, emailRule]" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field name="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              variant="outlined"
              required
              clearable
              autocomplete="current-password"
              :rules="[requiredRule, minLength]">
              <template #append-inner>
                <v-btn
                  :icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  :aria-label="showPassword ? 'Nascondi password' : 'Mostra password'"
                  variant="text"
                  density="compact"
                  @click="showPassword = !showPassword" />
              </template>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row justify="center"
          class="mb-4">
          <v-col cols="10"
            md="4">
            <v-btn block
              color="secondary"
              type="submit"
              :loading="loading"
              :disabled="!formIsValid">
              Accedi
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import lightLogo from '@/assets/logo_nobg_light.png';
  import darkLogo from '@/assets/logo_nobg_dark.png';
  import { useRouter } from 'vue-router';
  import { useUserStore, useMessagesStore } from '@/stores';
  import { useValidationRules, useFirebaseAuthError, useIsDark } from '@/composables';
  import { FirebaseError } from 'firebase/app';
  import type { LoginPayload } from '@/types';

  // COMPOSABLE THEME
  const { isDark } = useIsDark();

  const email = ref('');
  const password = ref('');
  const showPassword = ref(false);
  const { emailRule, requiredRule, minLength } = useValidationRules();
  const formIsValid = ref(false);
  const router = useRouter();
  const userStore = useUserStore();
  const messagesStore = useMessagesStore();
  const loading = ref(false);
  const imgPath = computed(() => isDark.value ? darkLogo : lightLogo);
  const { getFirebaseAuthErrorMessage } = useFirebaseAuthError();

  const handleLogin = async () => {
    try {
      loading.value = true;
      const payload: LoginPayload = {
        email: email.value,
        password: password.value,
      };

      await userStore.login(payload);
      router.push('/dashboard');
    }
    catch (error: unknown) {
      const code = error instanceof FirebaseError ? error.code : '';
      const message = getFirebaseAuthErrorMessage(code);
      messagesStore.showMessage(message, 'error');
    } finally {
      loading.value = false;
    }
  };
</script>
