<template>
  <v-card class="e4">
    <v-responsive
      :style="{ background: `rgb(${red}, ${green}, ${blue})` }"
      height="300px"
    ></v-responsive>

    <v-card-text>
      <v-container
        fluid
        grid-list-lg
      >
        <v-layout
          row
          wrap
        >
          <v-flex xs9>
            <v-slider
              v-model="red"
              :max="255"
              label="R"
            ></v-slider>
          </v-flex>

          <v-flex xs3>
            <v-text-field
              v-model="red"
              class="mt-0"
              type="number"
            ></v-text-field>
          </v-flex>
          
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>