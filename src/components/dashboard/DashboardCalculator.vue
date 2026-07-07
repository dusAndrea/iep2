<template>
  <LayoutCardWrapper :title="title"
    :subtitle="subtitle">
    <template #cardContent>
      <v-container fluid
        class="p-0">
        <v-row>
          <v-col cols="12"
            lg="6">
            <v-autocomplete v-model="selectedStart"
              v-model:search="startSearch"
              :items="startSuggestions"
              label="Digita l'indirizzo di partenza"
              :loading="loadingStart"
              @update:search="handleStartSearch"
              item-title="display_name"
              return-object
              variant="outlined" />
          </v-col>
          <v-col cols="12"
            lg="6">
            <v-autocomplete v-model="selectedEnd"
              v-model:search="endSearch"
              :items="endSuggestions"
              label="Digita l'indirizzo di arrivo"
              :loading="loadingEnd"
              @update:search="handleEndSearch"
              item-title="display_name"
              return-object
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
              label="Che tipo di auto hai?"
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
              :disabled="!selectedStart || !selectedEnd || !travelChoice"
              :loading="loadingCalc"
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
        <span v-if="travelChoice !== 'car'" class="text-caption d-block mt-1">
          * Distanza calcolata in linea d'aria.
        </span>
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
  import { ref, onUnmounted } from 'vue';
  import debounce from 'lodash.debounce';
  import DashboardDialog from './DashboardDialog.vue';
  import { LayoutCardWrapper } from '@/components';
  import { OPENROUTESERVICE_API_KEY } from '@/services/api';

  defineProps<{
    title: string;
    subtitle: string;
  }>();

  // Coefficienti emissioni kg CO₂/km per persona (fonte: DEFRA 2023)
  const CAR_FACTORS: Record<string, Record<string, number>> = {
    petrol:        { small: 0.149, medium: 0.191, large: 0.235 },
    diesel:        { small: 0.138, medium: 0.168, large: 0.208 },
    hybrid:        { small: 0.105, medium: 0.120, large: 0.140 },
    plugin_hybrid: { small: 0.072, medium: 0.085, large: 0.100 },
    average:       { small: 0.145, medium: 0.180, large: 0.220 },
    battery:       { small: 0.047, medium: 0.053, large: 0.061 },
  };

  const MODE_FACTORS: Record<string, number> = {
    rail: 0.041,
    air:  0.255,
  };

  type GeocodingResult = {
    display_name: string;
    lat: string;
    lon: string;
  };

  // STATE
  const selectedStart = ref<GeocodingResult | null>(null);
  const selectedEnd = ref<GeocodingResult | null>(null);
  const startSearch = ref('');
  const endSearch = ref('');
  const startSuggestions = ref<GeocodingResult[]>([]);
  const endSuggestions = ref<GeocodingResult[]>([]);
  const loadingStart = ref(false);
  const loadingEnd = ref(false);
  const loadingCalc = ref(false);
  const result = ref<{ distance: number; emissions: number } | null>(null);
  const error = ref('');

  const travelChoice = ref<string | null>(null);
  const carTypeChoice = ref<string | null>(null);
  const carSizeChoice = ref<string | null>(null);

  const startController = ref<AbortController | null>(null);
  const endController = ref<AbortController | null>(null);

  onUnmounted(() => {
    startController.value?.abort();
    endController.value?.abort();
  });

  // STATIC CONST
  const travelMode = [
    { title: 'Auto', value: 'car' },
    { title: 'Treno', value: 'rail' },
    { title: 'Aereo', value: 'air' },
  ];

  const carSize = [
    { title: 'Piccola', value: 'small' },
    { title: 'Media', value: 'medium' },
    { title: 'Grande', value: 'large' },
  ];

  const carType = [
    { title: 'Benzina', value: 'petrol' },
    { title: 'Diesel', value: 'diesel' },
    { title: 'Ibrida', value: 'hybrid' },
    { title: 'Ibrida Plug-in', value: 'plugin_hybrid' },
    { title: 'Non so (media)', value: 'average' },
    { title: 'Elettrica', value: 'battery' },
  ];

  function getEmissionFactor(): number {
    if (travelChoice.value === 'car') {
      const type = carTypeChoice.value ?? 'average';
      const size = carSizeChoice.value ?? 'medium';
      return CAR_FACTORS[type]?.[size] ?? 0.180;
    }
    return MODE_FACTORS[travelChoice.value ?? 'rail'] ?? 0.041;
  }

  // Distanza in linea d'aria (Haversine) per treno e aereo
  function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  async function searchPlaces(
    query: string,
    controllerRef: typeof startController,
    suggestionsRef: typeof startSuggestions,
    loadingRef: typeof loadingStart,
  ): Promise<void> {
    if (query.length < 3) return;

    error.value = '';
    loadingRef.value = true;
    controllerRef.value?.abort();
    controllerRef.value = new AbortController();

    try {
      const params = new URLSearchParams({
        q: query,
        format: 'json',
        addressdetails: '1',
        limit: '10',
      });

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?${params.toString()}`,
        { signal: controllerRef.value.signal, headers: { Accept: 'application/json' } },
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      suggestionsRef.value = await res.json();
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      error.value = 'Errore durante la ricerca degli indirizzi.';
    } finally {
      loadingRef.value = false;
    }
  }

  const debouncedStartSearch = debounce(
    (q: string) => searchPlaces(q, startController, startSuggestions, loadingStart),
    400,
  );

  const debouncedEndSearch = debounce(
    (q: string) => searchPlaces(q, endController, endSuggestions, loadingEnd),
    400,
  );

  function handleStartSearch(query: string) {
    if (query.length >= 3) debouncedStartSearch(query);
  }

  function handleEndSearch(query: string) {
    if (query.length >= 3) debouncedEndSearch(query);
  }

  async function calculateEmissions() {
    error.value = '';
    result.value = null;

    const start = selectedStart.value;
    const end = selectedEnd.value;

    if (!start || !end) {
      error.value = 'Seleziona indirizzi validi dai suggerimenti.';
      return;
    }

    const factor = getEmissionFactor();
    loadingCalc.value = true;

    try {
      let distanceKm: number;

      if (travelChoice.value === 'car') {
        const res = await fetch('https://api.openrouteservice.org/v2/directions/driving-car', {
          method: 'POST',
          headers: {
            Authorization: OPENROUTESERVICE_API_KEY,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            coordinates: [
              [parseFloat(start.lon), parseFloat(start.lat)],
              [parseFloat(end.lon), parseFloat(end.lat)],
            ],
          }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        distanceKm = data.routes[0].summary.distance / 1000;
      } else {
        distanceKm = haversineKm(
          parseFloat(start.lat), parseFloat(start.lon),
          parseFloat(end.lat), parseFloat(end.lon),
        );
      }

      result.value = {
        distance: distanceKm,
        emissions: distanceKm * factor,
      };
    } catch {
      error.value = 'Errore durante il calcolo delle emissioni.';
    } finally {
      loadingCalc.value = false;
    }
  }
</script>
