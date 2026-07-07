import { useMessagesStore } from "@/stores";

const CARBON_API_URL = import.meta.env.VITE_CARBON_API_URL;

export const OPENROUTESERVICE_API_KEY = import.meta.env.VITE_OPENROUTESERVICE_API_KEY;

export async function fetchCarbonIntensity() {
  const feedbackStore = useMessagesStore();

  try {
    const res = await fetch(CARBON_API_URL);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    const values = data.data || [];

    return values.map((entry: { from: string; intensity: { actual: number } }) => ({
      time: entry.from,
      value: entry.intensity.actual
    }));
  } catch (e) {
    feedbackStore.showMessage(`Errore caricamento carbon intensity: ${e}`, 'warning');
    return [];
  }
}
