<template>
  <div class="error-404">
      <v-flex xs12 sm6 offset-sm3>
      <v-card color="indigo lighten-5">
        <v-card-title class="justify-center" >
            <div>
                <h1>Página não encontrada</h1>
            </div>    
        </v-card-title>
        <v-card-text>
            <p class="text-md-center">A página que você tentou acessar não existe.</p>
        </v-card-text>
      </v-card>
      </v-flex>
  </div>
</template>

<script>
export default {
  name: 'error-404',
  props: {
    error: {
      type: Object,
      default: () => {},
    },
  },
};
</script>