<template>
  <v-card color="background"
    :border="false"
    :flat="true">
    <v-card-title>
      <v-row align-content="center"
        justify="center">
        <v-col align-self="center"
          cols="6">
          <v-img :width="300"
            aspect-ratio="16/9"
            cover
            :src="imgPath"
            alt="Logo Gaia Data"
            class="mx-auto" />
        </v-col>
      </v-row>
      <v-row class="my-3">
        <v-col>
          <h1 class="text-h4 text-secondary">Crea un account</h1>
        </v-col>
      </v-row>
    </v-card-title>

    <v-spacer />

    <v-card-subtitle>Ha già un account?
      <RouterLink :to="{ name: 'login' }">Accedi</RouterLink>
    </v-card-subtitle>

    <v-card-text>
      <v-form @submit.prevent="handleRegister"
        v-model="formIsValid">
        <v-row>
          <v-col cols="12"
            md="6">
            <v-text-field v-model="firstName"
              label="Nome"
              type="text"
              required
              variant="outlined"
              clearable
              :rules="[requiredRule]" />
          </v-col>
          <v-col cols="12"
            md="6">
            <v-text-field v-model="lastName"
              label="Cognome"
              type="text"
              required
              variant="outlined"
              clearable
              :rules="[requiredRule]" />
          </v-col>

          <v-col cols="12"
            md="6">
            <v-text-field v-model="email"
              label="Email"
              type="email"
              required
              variant="outlined"
              clearable
              :rules="[requiredRule, emailRule]" />
          </v-col>
          <v-col cols="12"
            md="6">
            <v-text-field v-model="confirmEmail"
              label="Ripeti Email"
              type="email"
              required
              variant="outlined"
              clearable
              :rules="[requiredRule, emailRule, matchRule(email)]" />
          </v-col>

          <v-col cols="12"
            md="6">
            <v-text-field name="password"
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              required
              variant="outlined"
              clearable
              autocomplete="new-password"
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
          <v-col cols="12"
            md="6">
            <v-text-field name="confirmPassword"
              id="confirmPassword"
              v-model="confirmPassword"
              label="Conferma Password"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              variant="outlined"
              clearable
              autocomplete="new-password"
              :rules="[requiredRule, minLength, matchRule(password)]">
              <template #append-inner>
                <v-btn
                  :icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  :aria-label="showConfirmPassword ? 'Nascondi conferma password' : 'Mostra conferma password'"
                  variant="text"
                  density="compact"
                  @click="showConfirmPassword = !showConfirmPassword" />
              </template>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row justify="center"
          class="mb-4">
          <v-col cols="10"
            md="4">
            <v-btn block
              color="primary"
              type="submit"
              :loading="loading"
              :disabled="!formIsValid">
              Registrati
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
  import { useUserStore, useMessagesStore } from '@/stores';
  import { useRouter } from 'vue-router';
  import { useValidationRules, useIsDark } from '@/composables';
  import type { RegisterPayload } from '@/types';

  // COMPOSABLE THEME
  const { isDark } = useIsDark();

  // STORE
  const userStore = useUserStore();
  const messagesStore = useMessagesStore();

  // STATE
  const showPassword = ref(false);
  const showConfirmPassword = ref(false);
  const firstName = ref('');
  const lastName = ref('');
  const email = ref('');
  const confirmEmail = ref('');
  const password = ref('');
  const confirmPassword = ref('');

  const router = useRouter();
  const { emailRule, requiredRule, minLength, matchRule } = useValidationRules();
  const formIsValid = ref(false);
  const loading = ref(false);

  // COMPUTED
  const imgPath = computed(() => isDark.value ? darkLogo : lightLogo);

  // METHOD
  const handleRegister = async () => {
    try {
      loading.value = true;
      const payload: RegisterPayload = {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
      };

      await userStore.register(payload);

      messagesStore.showMessage('Utente creato con successo', 'success');

      router.push({ name: 'login' });
    } catch (e: unknown) {
      messagesStore.showMessage(e instanceof Error ? e.message : 'Errore sconosciuto', 'error');
    } finally {
      loading.value = false;
    }
  };
</script>
<style lang="scss">
.login {
  &__poster {
    img {
      filter: opacity(0.3);
    }
  }
}
</style>
