<template>
    <v-app>
      <v-app-bar app color="primary" dark>
        <v-btn text color="white">Home</v-btn>
        <v-spacer></v-spacer>
        <v-btn text color="white" @click="mostrarRecepcio()">Recepció comandes</v-btn>
        <v-btn text color="white" @click="mostrarPreparacio()">Preparació comandes</v-btn>
        <v-btn text color="white" @click="mostrarResum()">Resum comandes</v-btn>
      </v-app-bar>
      <v-main>
        <div v-show="showRecepcio">
          <h1>Recepció de comandes</h1>
          <v-card v-for="(comanda, index) in comandes" :key="index" class="mx-auto my-4" max-width="400">

          <v-card-subtitle>ID comanda: {{ comanda.id_comanda }}</v-card-subtitle>
          <v-card-subtitle>ID usuari: {{ comanda.id_usuari }}</v-card-subtitle>
          <v-card-subtitle>Número de productes: {{  comanda.productes.length }}</v-card-subtitle>

          <v-card-actions>
            <v-btn color="green darken-1" text @click="acceptarComanda(comanda.id_comanda)">Acceptar</v-btn>
            <v-btn color="red darken-1" text @click="rebutjarComanda(comanda.id_comanda)">Rebutjar</v-btn>
          </v-card-actions>
        </v-card>
        </div>
        <div v-show="showPreparacio">
          <v-row>
            <v-col cols="6">
              <h1>Preparació de comandes</h1>
              <v-card @click="mostrarDetalls(index)" v-for="(comanda, index) in com_preparacio" :key="index" class="mx-auto my-4" max-width="400" :class="getItemColor(index)">
              <v-card-subtitle> Comanda número {{ index }} </v-card-subtitle>
              <v-card-subtitle> ID comanda: {{ comanda.id_comanda }} </v-card-subtitle>
              <v-card-subtitle> ID usuari: {{ comanda.id_usuari }} </v-card-subtitle>
              </v-card>
            </v-col>
            <v-col name="detalls" cols="6" class="mt-10">
            <v-card>
            <v-card-subtitle> ID comanda: {{ this.comanda_detalls.id_usuari }}  </v-card-subtitle>
            <v-card-subtitle> ID usuari: {{  this.comanda_detalls.id_usuari }} </v-card-subtitle>
            <v-card-subtitle>
              <v-list>
              <b>Llista de productes de la comanda</b>
              <v-list-item v-for="(producte, index) in this.comanda_detalls.productes" :key="index">
              <v-list-item-content>
                <v-list-item-title> ID producte: {{ producte.id_producte }} </v-list-item-title>
                <v-list-item-subtitle> Quantitat: {{ producte.quantitat }} </v-list-item-subtitle>
              </v-list-item-content>
              </v-list-item>
            </v-list>
            </v-card-subtitle>
            <v-card-actions>
            </v-card-actions>
            </v-card>
            <v-row justify="center">
              <v-btn class="mt-5" @click="marcar_per_recollir()">Marcar per recollir</v-btn>
            </v-row>
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
  import { getComandes } from './communicationsManager.js';

  export default {
    name: "App",
    data() {
      return {
        showRecepcio: false,
        showPreparacio: false,
        showResum: false,
        index_comanda_detalls: -1,
        comanda_detalls: {},
        comandes: [],
        com_preparacio: [],
        com_per_recollir: [],
      }
    },
    created(){
      getComandes().then((response) => {
        this.comandes = response;
      })
    },
    methods:{
      mostrarRecepcio(){
          this.showRecepcio = true;
          this.showPreparacio = false;
          this.showResum = false;
      },
      mostrarPreparacio(){
          this.showRecepcio = false;
          this.showPreparacio = true;
          this.showResum = false;
      },
      mostrarResum(){
          this.showRecepcio = false;
          this.showPreparacio = false;
          this.showResum = true;
      },
      acceptarComanda(id){
        console.log(id);
        for (let i = 0; i < this.comandes.length; i++) {
          if (this.comandes[i].id_comanda == id) {
            this.com_preparacio.push(this.comandes[i]);
            this.comandes.splice(i, 1);
          }
        }
        console.log("Comanda acceptada");
      },
      rebutjarComanda(id){
        for (let i = 0; i < this.comandes.length; i++) {
          if (this.comandes[i].id_comanda == id) {
            this.comandes.splice(i, 1);
          }
        }
        console.log("Comanda rebutjada");
      },
      mostrarDetalls(index){
        this.comanda_detalls = this.com_preparacio[index]
        this.index_comanda_detalls = index;
      },
      getItemColor(index){
        switch(index){
          case 0: return 'red--text';
          case 1: return 'orange--text';
          case 2: return 'yellow--text';
          default: return 'white--text'
        }
      },
      marcar_per_recollir(){
        if(this.index_comanda_detalls >= 0){
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
  .red--text { background-color: red; }
  .orange--text { background-color: orange; }
  .yellow--text { background-color: yellow; }
  .white--text { background-color: white; }

  detalls{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  </style>
  