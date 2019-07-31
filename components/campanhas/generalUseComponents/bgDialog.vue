<template>
    <v-layout justify-end>
        <v-tooltip bottom>
        <template v-slot:activator="{ on }">
            <v-btn class="mx-2" fab dark small color="primary" @click="dialog = true" v-on="on">
                <v-icon dark>aspect_ratio</v-icon>
            </v-btn>
        </template>
        <span>Adicionar backgrounds</span>
        </v-tooltip>  
        <v-dialog v-model="dialog" persistent max-width="500">
        <v-card>
            <v-card-title class="headline primary--text">Backgrounds cadastrados:</v-card-title>
            <v-card-text>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</v-card-text>
            <v-card></v-card>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false">Fechar</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
    </v-layout>    
</template>

<script>
export default {
    data: () => ({
        dialog: false
    
    }),
}      
</script>
