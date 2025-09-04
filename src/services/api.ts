import axios from 'axios';
import { useMessagesStore } from "@/stores";

const CARBON_API_URL = import.meta.env.VITE_CARBON_API_URL;

export const OPENROUTESERVICE_API_KEY = import.meta.env.VITE_OPENROUTESERVICE_API_KEY;

export async function fetchCarbonIntensity() {
  const feedbackStore = useMessagesStore();

  try {
    const res = await axios.get(CARBON_API_URL);
    const data = await res.json();
    const values = data.data || [];

    return values.map((entry) => ({
      time: entry.from,
      value: entry.intensity.actual
    }));
  } catch (e) {
    feedbackStore.showMessage(`Errore caricamento carbon intensity: ${e}`, 'warning');
    return [];
  }
}
