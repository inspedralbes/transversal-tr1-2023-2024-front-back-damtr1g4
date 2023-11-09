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
      <div v-show="showRecepcio" :align="'center'">
        <h1>Recepció de comandes</h1>
        <v-card v-for="(comanda, index) in comandes" :key="index" class="mx-auto my-4" max-width="400">
          <v-card-subtitle :align="'start'">Data: {{ comanda.data }} {{ comanda.hora }}</v-card-subtitle>
          <v-card-subtitle :align="'start'">ID comanda: {{ comanda.id_comanda }}</v-card-subtitle>
          <v-card-subtitle :align="'start'">ID usuari: {{ comanda.id_usuari }}</v-card-subtitle>
          <v-card-subtitle :align="'start'">Número de productes: {{ comanda.productes.length }}</v-card-subtitle>
          <v-card-subtitle :align="'start'">Preu: {{ comanda.preu }}€</v-card-subtitle>
          <v-card-actions>
            <v-btn color="green darken-1" text @click="acceptarComanda(comanda.id_comanda)"
              :this.isListo="false">Acceptar</v-btn>
            <v-btn color="red darken-1" text @click="rebutjarComanda(comanda.id_comanda)">Rebutjar</v-btn>
          </v-card-actions>
        </v-card>
      </div>
      <div v-show="showPreparacio" :align="'center'">
        <v-row>
          <v-col cols="4">
            <h1>Recién Entrado</h1>
            <v-card @click="mostrarDetalls(comanda)" v-for="(comanda, index) in comandasRecienEntrado" :key="index"
              class="mx-auto my-4 green--text card" max-width="400">
              <br>
              <v-card-subtitle :align="'start'"> Comanda número {{ index }} </v-card-subtitle>
              <v-card-subtitle :align="'start'">ID usuari: {{ comanda.id_usuari }}</v-card-subtitle>
              <v-card-subtitle :align="'start'">Preu: {{ comanda.preu }}€</v-card-subtitle>
              <br>
              <v-btn class="btnListo" @click.stop=" moverAComandasPreparadas(comanda)" :this.isListo="true">Listo</v-btn>
            </v-card>
          </v-col>
          <v-col cols="4">
            <h1>Lleva un rato</h1>

            <v-card :align="'center'" @click="mostrarDetalls(comanda)" v-for="(comanda, index) in comandasLlevaRato"
              :key="index" class="mx-auto my-4 orange--text card" max-width="400">
              <br>
              <v-card-subtitle :align="'start'"> Comanda número {{ index }} </v-card-subtitle>
              <v-card-subtitle :align="'start'">ID usuari: {{ comanda.id_usuari }}</v-card-subtitle>
              <v-card-subtitle :align="'start'">Preu: {{ comanda.preu }}€</v-card-subtitle>
              <br>
              <v-btn class="btnListo" @click.stop=" moverAComandasPreparadas(comanda)" :this.isListo="true">Listo</v-btn>
            </v-card>

          </v-col>
          <v-col cols="4">
            <h1>Importante</h1>
            <v-card :align="'center'" @click="mostrarDetalls(comanda)" v-for="(comanda, index) in comandasImportante"
              :key="index" class="mx-auto my-4 red--text card" max-width="400">
              <br>
              <v-card-subtitle :align="'start'"> Comanda número {{ index }} </v-card-subtitle>
              <v-card-subtitle :align="'start'">ID usuari: {{ comanda.id_usuari }}</v-card-subtitle>
              <v-card-subtitle :align="'start'">Preu: {{ comanda.preu }}€</v-card-subtitle>
              <br>
              <v-btn class="btnListo" @click.stop=" moverAComandasPreparadas(comanda)" :this.isListo="true">Listo</v-btn>
            </v-card>
          </v-col>
        </v-row>
        <!-- Tarjeta de detalles -->
        <v-dialog v-model="mostrarDetallesDialog">
          <v-card>
         
            <v-card-title>Detalles de la Comanda</v-card-title>
            <v-card-text>
              <p>ID de usuario: {{ comandaSeleccionada.id_usuari }}</p>
              <p>Data: {{ comandaSeleccionada.data }}</p>
              <p>Número de productes: {{ comandaSeleccionada.productes.length }}</p>
              <p>Preu: {{ comandaSeleccionada.preu }}€</p>
              
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="mostrarDetallesDialog = false">Cerrar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </div>
      <div class="ml-4" v-show="showResum" :align="'start'" style="display: flex;">
        <div style="flex: 1;">
          <h1>Resum de comandes</h1>
          <v-card v-for="(comanda, index) in com_per_recollir" :key="index" max-width="400" height="175" class="cardResum my-4">
            <v-card-subtitle> Comanda número {{ index }} </v-card-subtitle>
            <v-card-subtitle>ID usuari: {{ comanda.id_usuari }}</v-card-subtitle>
            <v-card-subtitle>Data: {{ comanda.data }}</v-card-subtitle>
            <v-card-subtitle>Número de productes: {{ comanda.productes.length }}</v-card-subtitle>
            <v-card-subtitle>Preu: {{ comanda.preu }}€</v-card-subtitle>
            <v-card-subtitle>Tiempo de preparación: {{ comanda.tiempoPreparacion }} segundos</v-card-subtitle>
            <v-card-actions>
              <v-btn class="btnListo" @click="finalitzarComanda(comanda.id_comanda, index)">Recollida</v-btn>
            </v-card-actions>
          </v-card>
        </div>

        <div style="flex: 1;">
          <img src="../../server/grafics/RecaudacioPerDates.png">
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { getComandes, archivarComanda } from './../services/connectionManager';
import { io } from "socket.io-client";

export default {
  name: "App",
  data() {
    return {
      socket: null,
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
      isListo: false,
      mostrarDetallesDialog: false,
      comandaSeleccionada: null,
    }
  },

  mounted(){
    this.socket = io("http://takeaway4.dam.inspedralbes.cat:3777");

    this.socket.on('novaComanda', (comanda) => {
      console.log("Nueva comanda recibida");
      this.comandes.push(comanda);
    });
  },

  // CREATED
  created() {
    getComandes().then((response) => {
      this.comandes = response;
      console.log(this.comandes);
    })
  },

  methods: {
    finalitzarComanda(comanda_id, index){
      archivarComanda(comanda_id);
      this.com_per_recollir.splice(index, 1);
    },
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

    mostrarDetalls(comanda) {
      this.comandaSeleccionada = comanda;
      this.mostrarDetallesDialog = true;
    },

    // ACEPTAR COMANDES
    acceptarComanda(id) {
      const comandaIndex = this.comandes.findIndex((comanda) => comanda.id_comanda === id);
      if (comandaIndex !== -1) {
        const comanda = this.comandes[comandaIndex];

        // Verificar si la comanda ha sido aceptada previamente
        if (!comanda.aceptada) {
          // Marcar la comanda como aceptada
          comanda.aceptada = true;
          comanda.preparacionStart = new Date().getTime();
          // Agregar la comanda a comandasRecienEntrado y establecer su estado isListo
          comanda.isListo = false; // Puedes establecerlo en false por defecto
          this.comandasRecienEntrado.push(comanda);

          // Eliminar la comanda de comandes
          this.comandes.splice(comandaIndex, 1);

          // Iniciar un temporizador para cambiar el estado de la comanda
          const timerId = setTimeout(() => {
            // Verificar si la comanda sigue en la lista de "Recién Entrado" antes de pasar a "Lleva un rato"
            const index = this.comandasRecienEntrado.indexOf(comanda);
            if (index !== -1) {
              this.comandasLlevaRato.push(comanda);
              this.comandasRecienEntrado.splice(index, 1);
              clearTimeout(timerId);

              // Iniciar un segundo temporizador para cambiar la comanda a "Importante"
              if (!comanda.isListo) {
                const timerId2 = setTimeout(() => {
                  // Verificar si la comanda aún está en la lista de "Lleva un rato" antes de pasar a "Importante"
                  const index = this.comandasLlevaRato.indexOf(comanda);
                  if (index !== -1) {
                    this.comandasImportante.push(comanda);
                    this.comandasLlevaRato.splice(index, 1);
                    console.log("Comanda importante");
                  }
                  clearTimeout(timerId2);
                }, 10000); // 10 segundos
              }
            }
          }, 10000); // 10 segundos
          console.log("Comanda aceptada");
          this.timers[comanda.id_comanda] = timerId;
        } else {
          console.error("La comanda ya ha sido aceptada anteriormente");
        }
      } else {
        console.error("Comanda no encontrada");
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

    moverAComandasPreparadas(comanda) {
      if (comanda) {
        // Actualizar el tiempo de preparación
        const startTime = comanda.preparacionStart;
        const endTime = new Date();
        comanda.tiempoPreparacion = (endTime - startTime) / 1000;



        // Agregar la comanda a la lista de comandas preparadas
        this.com_per_recollir.push(comanda);

        // Elimina la comanda de la lista original (donde se encuentre)
        const comandaIndexRecienEntrado = this.comandasRecienEntrado.indexOf(comanda);
        if (comandaIndexRecienEntrado !== -1) {
          this.comandasRecienEntrado.splice(comandaIndexRecienEntrado, 1);
        }

        const comandaIndexLlevaRato = this.comandasLlevaRato.indexOf(comanda);
        if (comandaIndexLlevaRato !== -1) {
          this.comandasLlevaRato.splice(comandaIndexLlevaRato, 1);
        }

        const comandaIndexImportante = this.comandasImportante.indexOf(comanda);
        if (comandaIndexImportante !== -1) {
          this.comandasImportante.splice(comandaIndexImportante, 1);
        }

        // Detén el temporizador utilizando el mismo id_comanda
        const timerId = this.timers[comanda.id_comanda];
        clearTimeout(timerId);

        // Actualizar el estado del botón (isListo)
        this.isListo = true;
        console.log("Comanda marcada como Listo");
      } else {
        console.error("Comanda no aceptada");
      }
    },

  }
}
</script>

<style scoped>
.cardResum{
  border: 1px solid rgb(101, 101, 252);
  
}
.btnListo {
  position: relative;
  padding: 10px 20px;
  border-radius: 7px;
  border: 1px solid rgb(0, 0, 0);
  font-size: 14px;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 2px;
  background: transparent;
  color: gray;
  overflow: hidden;
  box-shadow: 0 0 0 0 transparent;
  -webkit-transition: all 0.2s ease-in;
  -moz-transition: all 0.2s ease-in;
  transition: all 0.2s ease-in;
}

.btnListo:hover {
  background: rgb(0, 0, 0);
  box-shadow: 0 0 30px 5px rgba(100, 100, 100, 0.815);
  -webkit-transition: all 0.2s ease-out;
  -moz-transition: all 0.2s ease-out;
  transition: all 0.2s ease-out;
}

.btnListo:hover::before {
  -webkit-animation: sh02 0.5s 0s linear;
  -moz-animation: sh02 0.5s 0s linear;
  animation: sh02 0.5s 0s linear;
}

.btnListo::before {
  content: '';
  display: block;
  width: 0px;
  height: 86%;
  position: absolute;
  top: 7%;
  left: 0%;
  opacity: 0;
  background: #fff;
  box-shadow: 0 0 50px 30px #fff;
  -webkit-transform: skewX(-20deg);
  -moz-transform: skewX(-20deg);
  -ms-transform: skewX(-20deg);
  -o-transform: skewX(-20deg);
  transform: skewX(-20deg);
}

@keyframes sh02 {
  from {
    opacity: 0;
    left: 0%;
  }

  50% {
    opacity: 1;
  }

  to {
    opacity: 0;
    left: 100%;
  }
}

.btnListo:active {
  box-shadow: 0 0 0 0 transparent;
  -webkit-transition: box-shadow 0.2s ease-in;
  -moz-transition: box-shadow 0.2s ease-in;
  transition: box-shadow 0.2s ease-in;
}

.card {
  width: 175px;
  height: 170px;
  border-radius: 50px;
  background: #ffffff;
  box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
}

.red--text {
  border: 1px solid rgb(255, 0, 0);
}

.orange--text {
  border: 1px solid orange;
}

.green--text {
  border: 1px solid rgb(31, 255, 1);

}

detalls {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
