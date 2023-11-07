<template>
        <br><br><br>
        <v-layout class="custom-background" :align="'center'">
            <v-app-bar class="custom-app-bar" color="surface-variant">
                <v-toolbar-title class="custom-title">Green Experience</v-toolbar-title>
                <router-link :to="'/recepcioComandes/'">
                    <v-btn class="mr-5" elevation="6" large color="white" text @click="gestionPedidos">Gestionar
                        Pedidos</v-btn>
                </router-link>
            </v-app-bar>
            <v-main>
                <v-row justify="center">
                    <v-col v-for="tipo in tipos" :key="tipo.id" :justify="'center'" cols="12" sm="6" md="4" lg="3">
                        <v-card width="350" height="450" class="custom-card">
                            <router-link :to="'/' + tipo.tipo + '/'"> <!-- Link a la página correspondiente -->
                                <v-btn variant="text" width="350" height="400">
                                    <v-img :src="tipo.fotos" width="400" height="400" alt="Imagen del tipo"
                                        class="img-resize"></v-img>
                                </v-btn><br>
                            </router-link>
                            <v-card-title style="color: #333; font-size: 20px; text-align: center;">{{ tipo.tipo
                            }}</v-card-title>
                        </v-card>
                    </v-col>
                </v-row>
            </v-main>
        </v-layout>
</template>
  
<script>
import { getProductos } from './../services/connectionManager';
import { getTipos } from './../services/connectionManager';


export default {
    data() {
        return {
            tipos: [],
            productos: [],
        };
    },
    methods: {
        getTotal() {
            getProductos().then((response) => {
                this.productos = response;
                console.log(response);
            }).catch((error) => {
                console.error("Error al obtener productos: ", error);
            });

            getTipos().then((response) => {
                this.tipos = response;
                console.log(response);
            }).catch((error) => {
                console.error("Error al obtener productos: ", error);
            });

        },

        gestionPedidos() {

        },

    },
    //CONSOLA
    created() {
        this.getTotal();
    },
    mounted() {
        console.log("MONTADO");
    },

    updated() {
        console.log("UPDATED");
    }
};
</script>

<style scoped>
.custom-title {
    font-size: 24px;
    font-weight: bold;
}

.custom-app-bar {
    padding: 10px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
}

.custom-background {
    min-height: 100vh;
    --s: 200px; /* control the size */
  --c1: #1d1d1d;
  --c2: #4e4f51;
  --c3: #3c3c3c;

  background: repeating-conic-gradient(
        from 30deg,
        #0000 0 120deg,
        var(--c3) 0 180deg
      )
      calc(0.5 * var(--s)) calc(0.5 * var(--s) * 0.577),
    repeating-conic-gradient(
      from 30deg,
      var(--c1) 0 60deg,
      var(--c2) 0 120deg,
      var(--c3) 0 180deg
    );
  background-size: var(--s) calc(var(--s) * 0.577);
}

.custom-card {
    background-color: rgb(202, 202, 202);
    text-align: center;
    font-size: 20px;
}

.custom-card:hover {
    background-color:  rgb(255, 255, 255);
    color: #8db1ab;
}
</style>