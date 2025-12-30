<template>
  <LayoutCardWrapper :title="title"
    :subtitle="subtitle">
    <template #cardContent>
      <v-container fluid
        class="p-0">
        <v-row>
          <v-col cols="12"
            lg="6">
            <v-autocomplete v-model="startQuery"
              v-model:search="startSearch"
              :items="startSuggestions"
              label="Digita l'indirizzo di partenza"
              :loading="loadingStart"
              @update:search="handleStartSearch"
              item-title="display_name"
              item-value="display_name"
              variant="outlined" />
          </v-col>
          <v-col cols="12"
            lg="6">
            <v-autocomplete v-model="endQuery"
              v-model:search="endSearch"
              :items="endSuggestions"
              label="Digita l'indirizzo di arrivo"
              :loading="loadingEnd"
              @update:search="handleEndSearch"
              item-title="display_name"
              item-value="display_name"
              variant="outlined" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-select v-model="travelChoice"
              :items="travelMode"
              label="Che mezzo usi?"
              variant="outlined" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12"
            lg="6">
            <v-select :disabled="travelChoice !== 'car'"
              v-model="carTypeChoice"
              :items="carType"
              label="Che tipo di auto hai??"
              variant="outlined" />
          </v-col>
          <v-col cols="12"
            lg="6">
            <v-select :disabled="travelChoice !== 'car'"
              v-model="carSizeChoice"
              :items="carSize"
              label="Che dimensioni ha la tua auto?"
              variant="outlined" />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <DashboardDialog />
          </v-col>

          <v-col class="d-flex justify-end">
            <v-btn color="primary"
              :disabled="!startQuery || !endQuery"
              :loading="loadingStart || loadingEnd"
              @click="calculateEmissions">
              Calcola
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <v-alert v-if="result"
        type="info"
        class="mt-4"
        border="start"
        border-color="green">
        Hai percorso {{ result.distance.toFixed(2) }} km e prodotto
        circa <strong>{{ result.emissions.toFixed(2) }} kg</strong> di CO₂.
      </v-alert>

      <v-alert v-if="error"
        type="error"
        class="mt-4">
        {{ error }}
      </v-alert>
    </template>
  </LayoutCardWrapper>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import debounce from 'lodash.debounce';
  import DashboardDialog from './DashboardDialog.vue';
  import { LayoutCardWrapper } from '@/components';
  import { OPENROUTESERVICE_API_KEY } from '@/services/api';

  defineProps<{
    title: string,
    subtitle: string;
  }>();

  // STATE
  const startQuery = ref<string | null>(null);
  const endQuery = ref<string | null>(null);
  const startSearch = ref('');
  const endSearch = ref('');
  const startSuggestions = ref<any[]>([]);
  const endSuggestions = ref<any[]>([]);
  const loadingStart = ref(false);
  const loadingEnd = ref(false);
  const result = ref<{ distance: number; emissions: number; } | null>(null);
  const error = ref('');

  const travelChoice = ref<string | null>(null);
  const carTypeChoice = ref<string | null>(null);
  const carSizeChoice = ref<string | null>(null);

  const startController = ref<AbortController | null>(null);
  const endController = ref<AbortController | null>(null);

  // STATIC CONST
  const travelMode = [
    { title: 'Auto', value: 'car' },
    { title: 'Treno', value: 'rail' },
    { title: 'Aereo', value: 'air' }
  ];

  const carSize = [
    { title: 'Piccola', value: 'small' },
    { title: 'Media', value: 'medium' },
    { title: 'Grande', value: 'large' }
  ];

  const carType = [
    { title: 'Benzina', value: 'petrol' },
    { title: 'Diesel', value: 'diesel' },
    { title: 'Ibrida', value: 'hybrid' },
    { title: 'Ibrida Plug-in', value: 'plugin_hybrid' },
    { title: 'Non so (Verrà calcolata una media)', value: 'average' },
    { title: 'Elettrica', value: 'battery' }
  ];

  async function searchPlaces(query: string, controllerRef: typeof startController, suggestionsRef: typeof startSuggestions, loadingRef: typeof loadingStart): Promise<void> {
    if (query.length < 3) { return; };

    error.value = '';
    loadingRef.value = true;

    controllerRef.value?.abort();

    controllerRef.value = new AbortController();

    try {
      const params = new URLSearchParams({
        q: query,
        format: 'json',
        addressdetails: '1',
        limit: '10'
      });

      const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
        signal: controllerRef.value.signal,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      suggestionsRef.value = data;

    } catch (err: any) {

      // ❗ Cancellazione nella fetch
      if (err.name === 'AbortError') {
        return; // richiesta cancellata, non è un errore
      }

      error.value = 'Errore durante la ricerca degli indirizzi.';
      console.error(err);

    } finally {
      loadingRef.value = false;
    }
  };

  const debouncedStartSearch = debounce((q: string) =>
    searchPlaces(q, startController, startSuggestions, loadingStart), 400);

  const debouncedEndSearch = debounce((q: string) =>
    searchPlaces(q, endController, endSuggestions, loadingEnd), 400);

  function handleStartSearch(query: string) {
    if (query.length < 3) return;
    debouncedStartSearch(query);
  };

  function handleEndSearch(query: string) {
    if (query.length < 3) return;
    debouncedEndSearch(query);
  };

  async function calculateEmissions() {
    error.value = '';
    const start = startSuggestions.value.find(s => s.display_name === startQuery.value);
    const end = endSuggestions.value.find(e => e.display_name === endQuery.value);

    if (!start || !end) {
      error.value = 'Seleziona indirizzi validi dai suggerimenti.';
      return;
    }

    try {
      const res = await fetch(
        'https://api.openrouteservice.org/v2/directions/driving-car',
        {
          method: 'POST',
          headers: {
            Authorization: OPENROUTESERVICE_API_KEY,
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            coordinates: [
              [parseFloat(start.lon), parseFloat(start.lat)],
              [parseFloat(end.lon), parseFloat(end.lat)]
            ]
          })
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      const distanceKm = data.routes[0].summary.distance / 1000;
      const emissionsKg = distanceKm * 0.12; // media 120g/km

      result.value = {
        distance: distanceKm,
        emissions: emissionsKg
      };
    } catch (err: any) {
      error.value = 'Errore durante il calcolo delle emissioni';
      console.error(err);
    }
  };
</script>
