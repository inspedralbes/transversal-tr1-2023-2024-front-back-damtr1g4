<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <router-link :to="'/'">
        <v-btn color="white" class="ml-5" elevation="6" large>
          Home
        </v-btn>
      </router-link>

      <v-spacer></v-spacer>
      <v-btn text color="white" class="ml-5" elevation="6" @click="mostrarRecepcio">Recepció comandes</v-btn>
      <v-btn text color="white" class="ml-5" elevation="6" @click="mostrarPreparacio">Preparació comandes</v-btn>
      <v-btn text color="white" class="ml-5" elevation="6" @click="mostrarResum">Resum comandes</v-btn>
    </v-app-bar>
    <v-main>
      <div v-show="showRecepcio">
        <h1>Recepció de comandes</h1>
        <v-card v-for="(comanda, index) in comandes" :key="index" class="mx-auto my-4" max-width="400">
          <v-card-subtitle>Data: {{ comanda.data }} {{ comanda.hora }}</v-card-subtitle>
          <v-card-subtitle>ID comanda: {{ comanda.id_comanda }}</v-card-subtitle>
          <v-card-subtitle>ID usuari: {{ comanda.id_usuari }}</v-card-subtitle>
          <v-card-subtitle>Número de productes: {{ comanda.productes.length }}</v-card-subtitle>
          <v-card-subtitle>Preu: {{ comanda.preu }}€</v-card-subtitle>
          <v-card-actions>
            <v-btn color="green darken-1" text @click="acceptarComanda(comanda.id_comanda)">Acceptar</v-btn>
            <v-btn color="red darken-1" text @click="rebutjarComanda(comanda.id_comanda)">Rebutjar</v-btn>
          </v-card-actions>
        </v-card>
      </div>
      <div v-show="showPreparacio">
        <v-row>
          <v-col cols="4">
            <h1>Recién Entrado</h1>
            <v-card @click="mostrarDetalls(index)" v-for="(comanda, index) in comandasRecienEntrado" :key="index"
              class="mx-auto my-4" max-width="400" :class="getItemColor(index)">
              <v-card-subtitle> Comanda número {{ index }} </v-card-subtitle>
              <v-card-subtitle>ID usuari: {{ comanda.id_usuari }}</v-card-subtitle>
              <v-card-subtitle>Data: {{ comanda.data }}</v-card-subtitle>
              <v-card-subtitle>Número de productes: {{ comanda.productes.length }}</v-card-subtitle>
              <v-card-subtitle>Preu: {{ comanda.preu }}€</v-card-subtitle>
            </v-card>
          </v-col>
          <v-col cols="4">
            <h1>Lleva un rato</h1>
            <v-card @click="mostrarDetalls(index)" v-for="(comanda, index) in comandasLlevaRato" :key="index"
              class="mx-auto my-4" max-width="400" :class="getItemColor(index)">
              <v-card-subtitle> Comanda número {{ index }} </v-card-subtitle>
              <v-card-subtitle>ID usuari: {{ comanda.id_usuari }}</v-card-subtitle>
              <v-card-subtitle>Data: {{ comanda.data }}</v-card-subtitle>
              <v-card-subtitle>Número de productes: {{ comanda.productes.length }}</v-card-subtitle>
              <v-card-subtitle>Preu: {{ comanda.preu }}€</v-card-subtitle>
            </v-card>
          </v-col>
          <v-col cols="4">
            <h1>Importante</h1>
            <v-card @click="mostrarDetalls(index)" v-for="(comanda, index) in comandasImportante" :key="index"
              class="mx-auto my-4" max-width="400" :class="getItemColor(index)">
              <v-card-subtitle> Comanda número {{ index }} </v-card-subtitle>
              <v-card-subtitle>ID usuari: {{ comanda.id_usuari }}</v-card-subtitle>
              <v-card-subtitle>Data: {{ comanda.data }}</v-card-subtitle>
              <v-card-subtitle>Número de productes: {{ comanda.productes.length }}</v-card-subtitle>
              <v-card-subtitle>Preu: {{ comanda.preu }}€</v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </div>
      <div v-show="showResum">
        <h1>Resum de comandes</h1>
        <v-card v-for="(comanda, index) in com_per_recollir" :key="index" class="mx-auto my-4" max-width="400">
          <v-card-subtitle> Comanda número {{ index }} </v-card-subtitle>
          <v-card-subtitle> ID comanda: {{ comanda.id_comanda }} </v-card-subtitle>
          <v-card-subtitle> ID usuari: {{ comanda.id_usuari }} </v-card-subtitle>
        </v-card>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { getComandes } from './../services/connectionManager';

export default {
  name: "App",
  data() {
    return {
      showRecepcio: false,
      showPreparacio: false,
      showResum: false,
      index_comanda_detalls: -1,
      comandes: [],
      com_preparacio: [],
      com_per_recollir: [],
      comandasRecienEntrado: [],
      comandasLlevaRato: [],
      comandasImportante: [],
      timers: {}, // Almacenará los temporizadores
      comanda_detalls: {},
    }
  },

  // CREATED
  created() {
    getComandes().then((response) => {
      this.comandes = response;
      console.log(this.comandes);
    })
  },

  methods: {
    mostrarRecepcio() {
      this.showRecepcio = true;
      this.showPreparacio = false;
      this.showResum = false;
    },
    mostrarPreparacio() {
      this.showRecepcio = false;
      this.showPreparacio = true;
      this.showResum = false;
    },
    mostrarResum() {
      this.showRecepcio = false;
      this.showPreparacio = false;
      this.showResum = true;
    },

    // ACEPTAR COMANDES 
    acceptarComanda(id) {
      const comandaIndex = this.comandes.findIndex((comanda) => comanda.id_comanda === id);
      if (comandaIndex !== -1) {
        const comanda = this.comandes[comandaIndex];

        // Agregar la comanda a comandasRecienEntrado
        this.comandasRecienEntrado.push(comanda);

        // Eliminar la comanda de comandes
        this.comandes.splice(comandaIndex, 1);

        // Iniciar un temporizador para cambiar el estado de la comanda
        const timerId = setTimeout(() => {
          this.comandasLlevaRato.push(comanda);
          const index = this.comandasRecienEntrado.indexOf(comanda);
          if (index !== -1) {
            this.comandasRecienEntrado.splice(index, 1);
          }
          clearTimeout(timerId);

          // Iniciar un segundo temporizador para cambiar la comanda a importante
          const timerId2 = setTimeout(() => {
            this.comandasImportante.push(comanda);
            const index = this.comandasLlevaRato.indexOf(comanda);
            if (index !== -1) {
              this.comandasLlevaRato.splice(index, 1);
            }
            clearTimeout(timerId2);
            console.log("Comanda importante");
          }, 10000); // 10 segundos
        }, 10000); // 10 segundos
        console.log("Comanda aceptada");
        this.timers[comanda.id_comanda] = timerId;
      } else {
        console.error("Comanda not found");
      }
    },


    // REBUTJAR COMANDA
    rebutjarComanda(id) {
      const comanda = this.comandes.find((com) => com.id_comanda === id);
      if (comanda) {
        const timerId = this.timers[comanda.id_comanda];
        clearTimeout(timerId); // Detener el temporizador
        const index = this.comandes.indexOf(comanda);
        if (index !== -1) {
          this.comandes.splice(index, 1);
          console.log("Comanda rebutjada");
        }
      } else {
        console.error("Comanda not found");
      }
    },

    mostrarDetalls(index) {
      this.comanda_detalls = this.com_preparacio[index];
      this.index_comanda_detalls = index;
    },

    getItemColor(index) {
      switch (index) {
        case 0:
          return 'red--text';
        case 1:
          return 'orange--text';
        case 2:
          return 'yellow--text';
        default:
          return 'white--text';
      }
    },

    marcar_per_recollir() {
      if (this.index_comanda_detalls >= 0) {
        this.com_per_recollir.push(this.comanda_detalls);
        this.com_preparacio.splice(this.index_comanda_detalls, 1);
        this.index_comanda_detalls = -1;
        this.comanda_detalls = {};
      }
    }
  }
}
</script>

<style scoped>
.red--text {
  background-color: red;
}

orange--text {
  background-color: orange;
}

.yellow--text {
  background-color: yellow;
}

white--text {
  background-color: white;
}

detalls {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
