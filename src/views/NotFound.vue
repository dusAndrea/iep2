<template>
  <v-app :full-height="true">
    <v-main :scrollable="true">
      <v-container fluid>
        <v-row>
          <v-col cols="12"
            offset="0"
            md="10"
            offset-md="1"
            lg="8"
            offset-lg="2">
            <v-row>
              <v-col cols="12">
                <h1 class="text-text">404 - Pagina non trovata</h1>
                <h3 class="text-primary">La pagina che cerchi non esiste.</h3>
                <router-link to="/"
                  class="mt-4 d-block text-primary">Torna alla home</router-link>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
