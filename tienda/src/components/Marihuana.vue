<template>
    <v-layout class="rounded rounded-md" :align="'center'">

        <v-app-bar :elevation="24">
            <template v-slot:append>
                <!-- Agrega un botón para activar/desactivar todos los productos -->

                <div class="toggle-border" icon @click="activarTodosProductos()">
                    <input type="checkbox" :checked="this.hayAlMenosUnProductoActivo">
                    <label :for="1">
                        <div class="handle"></div>
                    </label>
                </div>
                <v-card-title>Buscar productos</v-card-title>
            </template>
        </v-app-bar>

        <v-main>
            <v-row>
                <v-col v-for="producto in productosFiltrados" :key="producto.id" cols="12" sm="6" md="4" lg="4">
                    <br>
                    <v-card width="400" height="635" :class="'text-start'">
                        <!-- ACTIVAR / DES -->
                        <div class="toggle-border">
                            <input :id="'toggle-' + producto.id" type="checkbox" v-model="producto.isActive">
                            <label :for="'toggle-' + producto.id">
                                <div class="handle"></div>
                            </label>
                        </div>
                        <!-- ACTIVAR / DES -->
                        <v-img :src="'../' + producto.fotos" width="400" height="400" alt="Imagen del tipo"
                            class="img-resize"></v-img>
                        <v-card-title class="nom">{{ producto.nombre }}</v-card-title><!-- class="text-center" -->
                        <v-card-text class="preu">{{ producto.precio }}€</v-card-text>
                        <v-card-text class="dispo">Stock: {{ producto.stock }}</v-card-text>
                        <!-- EDITAR -->
                        <v-row justify="center">
                            <v-dialog v-model="dialog" persistent width="1024">
                                <template v-slot:activator="{ props }">
                                    <v-btn class="btn-edit" v-bind="props">
                                        Editar
                                    </v-btn>
                                </template>
                                <v-card>
                                    <v-card-title>
                                        <span class="text-h5">Editando Producto</span>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-container>
                                            <v-row>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-text-field label="Nombre de la planta*" required></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <VTextField label="Precio*" hint="añade el precio de la planta"
                                                        required></VTextField>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-text-field label="Img*" hint="añade el src de la foto"
                                                        persistent-hint required></v-text-field>
                                                </v-col>
                                                <v-col cols="12">
                                                    <VTextField label="Descripción"
                                                        hint="añade la descripción de la planta"></VTextField>
                                                </v-col>
                                                <v-col cols="12" sm="6">
                                                    <v-select :items="['0', '1-10', '11-50', '50+']" label="Stock*"
                                                        required></v-select>
                                                </v-col>
                                                <v-col cols="12" sm="6">
                                                    <v-select :items="['True', 'False']" label="Disponibilidad*"
                                                        required></v-select>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                        <small>*campos obligatorios</small>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="green" variant="text" @click="dialog = false">
                                            Cerrar
                                        </v-btn>
                                        <v-btn color="green" variant="text" @click="dialog = false">
                                            Guardar
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-row>
                        <!-- FIN EDITAR -->
                    </v-card>
                </v-col>
            </v-row>
        </v-main>
        <v-footer app>
            <v-pagination :length="3" :total-visible="3"></v-pagination>
        </v-footer>
    </v-layout>
</template>
  
<script>
import { VTextField } from 'vuetify/lib/components/index.mjs';
import { getProductos } from './../services/connectionManager';
import { getTipos } from './../services/connectionManager';

export default {
    data() {
        return {
            tipos: [],
            productos: [],
            name: "Layout",
            dialog: false,
            hayAlMenosUnProductoActivo: true,

        };
    },
    methods: {
        getTotal() {
            getProductos().then((response) => {
                this.productos = response.map((producto) => ({ ...producto, isActive: false }));
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

        // Cambiar el estado de todos los productos activos
        activarTodosProductos() {
            this.hayAlMenosUnProductoActivo= true;
            // Verifica si hay al menos un producto activo
            this.hayAlMenosUnProductoActivo = this.productos.some((producto) => producto.isActive);

            this.productos.forEach((producto) => {
                producto.isActive = !this.hayAlMenosUnProductoActivo;

                // enviar una solicitud al servidor para actualizar el estado del producto
            });
        },

        //ID DE ACT
        getBtn() {
            // Obtén todos los elementos checkbox y label
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            const labels = document.querySelectorAll('label');

            // Recorre los elementos label y asigna un id autoincremental a los elementos input y label
            labels.forEach((label, index) => {
                const id = `toggle-${index + 1}`;
                label.setAttribute('for', id);
                checkboxes[index].setAttribute('id', id);
            });//activarTodosProductos

        }

    },
    // PILLAR SOLO LOS tipo_id 1
    computed: {

        productosFiltrados() {
            return this.productos.filter((producto) => producto.tipo_id === 1);
        }
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
    },
    components: { VTextField }
};
</script>

<style>
.btn-edit:hover {
    background-color: green;
    color: white;
}

.preu {
    font: oblique bold 120% cursive;

    color: rgb(53, 207, 22);
}

.nom:hover {
    color: orange;
}

/* BTN ACT / DES  */
.toggle-border {
    border: 2px solid #f0ebeb;
    border-radius: 130px;
    margin-bottom: 45px;
    padding: 1px 2px;
    background: linear-gradient(to bottom right, white, rgba(220, 220, 220, .5)), white;
    box-shadow: 0 0 0 2px #fbfbfb;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.toggle-border:last-child {
    margin-bottom: 0;
}

.toggle-border input[type="checkbox"] {
    display: none;
}

.toggle-border label {
    position: relative;
    display: inline-block;
    width: 65px;
    height: 20px;
    background: #d13613;
    border-radius: 80px;
    cursor: pointer;
    box-shadow: inset 0 0 16px rgba(0, 0, 0, .3);
    transition: background .5s;
}

.toggle-border input[type="checkbox"]:checked+label {
    background: #13d162;
}

.handle {
    position: absolute;
    top: -8px;
    left: -10px;
    width: 35px;
    height: 35px;
    border: 1px solid whie;
    background: white;
    border-radius: 50%;
    box-shadow: 3px 5px 10px 0 rgba(0, 0, 0, .4);
    transition: left .4s;
}

.toggle-border input[type="checkbox"]:checked+label>.handle {
    left: calc(100% - 35px + 10px);
}
</style>