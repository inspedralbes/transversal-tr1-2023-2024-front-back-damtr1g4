<template>
    <br><br><br>
    <v-layout class="rounded rounded-md" :align="'center'">
        <v-app-bar color="surface-variant" title="Green Experience">
            <v-btn text @click="gestionPedidos">Gestionar Pedidos</v-btn>
        </v-app-bar>
        <v-main>
            <v-row justify="center">
                <v-col v-for="tipo in tipos" :key="tipo.id" :justify="'center'" cols="12" sm="6" md="4" lg="3">
                    <v-card width="350" height="450" class="text-center">
                        <router-link :to="'/'+tipo.tipo+'/' "> <!-- Link a la página correspondiente -->
                        <v-btn variant="text" width="350" height="400">
                                <v-img :src="tipo.fotos" width="400" height="400" alt="Imagen del tipo"
                                    class="img-resize"></v-img>
                        </v-btn><br>
                        </router-link>
                        <v-card-title>{{ tipo.tipo }}</v-card-title>
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