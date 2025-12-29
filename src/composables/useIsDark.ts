import { computed } from 'vue';
import { useTheme } from 'vuetify';

export function useIsDark() {
  const theme = useTheme();

  // Computed bidirezionale → toggle integrato
  const isDark = computed({
    get: () => theme.global.current.value.dark,
    set: (value) => {
      theme.global.name.value = value ? 'dark' : 'light';
    }
  });

  // Funzione di toggle (optional)
  const toggleDark = () => {
    isDark.value = !isDark.value;
  };

  return {
    isDark,
    toggleDark
  };
}
