<template>
  <v-dialog>
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn class="text-text"
        variant="plain"
        v-bind="activatorProps"
        text="non sai quale auto?"></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card title="Esempi di aiuto e relativi consumi">
        <v-card-text>
          <v-data-table :items="tableItems"
            hide-default-footer></v-data-table>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Chiudi"
            @click="isActive.value = false"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
<script setup lang="ts">
  const tableItems = [
    {
      dimensione: 'Piccola',
      benzina: "Motore inferiore a 1,4 litri",
      diesel: "Motore inferiore a 1,7 litri",
      altri: "Auto di segmento A e B",
      esempio: "Fiat 500, Opel Adam, Renault Clio, Ford Fiesta etc."
    },
    {
      dimensione: 'Media',
      benzina: "Motore da 1,4 a 2,0 litri",
      diesel: "Motore da 1,7 a 2,0 litri",
      altri: "Auto di segmento C",
      esempio: "Volkswagen Golf, Honda Civic etc."
    },
    {
      dimensione: 'Grande',
      benzina: "Motore da 2,0 litri",
      diesel: "Motore da 2,0 litri",
      altri: "Auto di segmento D",
      esempio: "BMW 3-Series, Volkswagen Passat etc."
    }
  ];
</script>
