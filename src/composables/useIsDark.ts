import { computed } from 'vue';
import { useTheme } from 'vuetify';

export function useIsDark() {
  const theme = useTheme();

  const isDark = computed({
    get: () => theme.global.current.value.dark,
    set: (value) => {
      theme.change(value ? 'dark' : 'light');
    },
  });

  const toggleDark = () => {
    isDark.value = !isDark.value;
  };

  return { isDark, toggleDark };
}
