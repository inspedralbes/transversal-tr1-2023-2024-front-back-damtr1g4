<template>
    <v-layout class="rounded rounded-md container" :align="'center'">
        <v-app-bar :elevation="24" :align="'start'" class="custom-app-bar">
            <v-row>
                <router-link :to="'/'">
                    <v-btn color="black" class="ml-5" elevation="6" large @click="">
                        Home
                    </v-btn>
                </router-link>
            </v-row>
            <template v-slot:append>
                <v-dialog v-model="this.addDialogOpen" persistent width="1024">
                    <template v-slot:activator="{ props }">
                        <v-btn class="mr-5" elevation="6" large v-bind="props" @click="openAddDialog(true)">
                            Añadir
                        </v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="text-h5">Añadiendo Producto</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field label="Nombre de la planta*" v-model="selectedAddProduct.nombre"
                                            required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <VTextField label="Precio*" v-model="selectedAddProduct.precio"
                                            hint="añade el precio de la planta" required></VTextField>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field label="Img*" v-model="selectedAddProduct.fotos"
                                            hint="añade el src de la foto" persistent-hint required></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <VTextField label="Descripción" v-model="selectedAddProduct.descripcion"
                                            hint="añade la descripción de la planta"></VTextField>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field label="Stock*" v-model="selectedAddProduct.stock"
                                            hint="añade la cantidad de Stock*" persistent-hint required></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                            <small>*campos obligatorios</small>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="green" variant="text" @click="openAddDialog(false)">
                                Cerrar
                            </v-btn>
                            <v-btn color="green" variant="text" @click="addProduct()">
                                Añadir
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <!-- botón para activar/desactivar todos los productos -->
                <div class="toggle-border" icon @click="handleButtonClick">
                    <input id="100" type="checkbox" :checked="hayAlMenosUnProductoActivo">
                    <label for="100">
                        <div class="handle"></div>
                    </label>
                </div>
            </template>
        </v-app-bar>
        <v-main>
            <v-row>
                <v-col v-for="producto in productosFiltrados" :key="producto.id" cols="12" sm="6" md="4" lg="4">
                    <br>
                    <v-card class="card" width="440" height="750">
                        <v-card width="400" height="690" class="heading" elevation="24">

                            <!-- ACTIVAR / DES -->
                            <div class="toggle-border" icon @click="toggleProduct(producto)">
                                <input :id="'toggle-' + producto.id" type="checkbox" :checked="producto.isActive">
                                <label :for="'toggle-' + producto.id">
                                    <div class="handle"></div>
                                </label>
                            </div>
                            <!-- ACTIVAR / DES -->
                            <v-img :src="'../' + producto.fotos" width="400" height="400" alt="Imagen del tipo"
                                class="img-resize"></v-img>
                            <v-card-title class="nom">{{ producto.nombre }}</v-card-title>
                            <v-card-text class="preu">{{ producto.precio }}€</v-card-text>
                            <v-card-text class="dispo">Stock: {{ producto.stock }}</v-card-text>
                            <!-- EDITAR -->
                            <v-row justify="center">
                                <v-dialog v-model="dialog" persistent width="1024">
                                    <template v-slot:activator="{ props }">
                                        <v-btn elevation="6" width="90" class="mr-4 btn-edit" v-bind="props"
                                            @click="editProduct(producto.id)">
                                            Editar
                                        </v-btn>
                                        <v-btn class="tooltip btnEliminar" elevation="6" width="90"
                                            v-model="selectedProduct.id" @click="eliminarProducto(producto.id)">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"
                                                height="25" width="25">
                                                <path fill="#6361D9"
                                                    d="M8.78842 5.03866C8.86656 4.96052 8.97254 4.91663 9.08305 4.91663H11.4164C11.5269 4.91663 11.6329 4.96052 11.711 5.03866C11.7892 5.11681 11.833 5.22279 11.833 5.33329V5.74939H8.66638V5.33329C8.66638 5.22279 8.71028 5.11681 8.78842 5.03866ZM7.16638 5.74939V5.33329C7.16638 4.82496 7.36832 4.33745 7.72776 3.978C8.08721 3.61856 8.57472 3.41663 9.08305 3.41663H11.4164C11.9247 3.41663 12.4122 3.61856 12.7717 3.978C13.1311 4.33745 13.333 4.82496 13.333 5.33329V5.74939H15.5C15.9142 5.74939 16.25 6.08518 16.25 6.49939C16.25 6.9136 15.9142 7.24939 15.5 7.24939H15.0105L14.2492 14.7095C14.2382 15.2023 14.0377 15.6726 13.6883 16.0219C13.3289 16.3814 12.8414 16.5833 12.333 16.5833H8.16638C7.65805 16.5833 7.17054 16.3814 6.81109 16.0219C6.46176 15.6726 6.2612 15.2023 6.25019 14.7095L5.48896 7.24939H5C4.58579 7.24939 4.25 6.9136 4.25 6.49939C4.25 6.08518 4.58579 5.74939 5 5.74939H6.16667H7.16638ZM7.91638 7.24996H12.583H13.5026L12.7536 14.5905C12.751 14.6158 12.7497 14.6412 12.7497 14.6666C12.7497 14.7771 12.7058 14.8831 12.6277 14.9613C12.5495 15.0394 12.4436 15.0833 12.333 15.0833H8.16638C8.05588 15.0833 7.94989 15.0394 7.87175 14.9613C7.79361 14.8831 7.74972 14.7771 7.74972 14.6666C7.74972 14.6412 7.74842 14.6158 7.74584 14.5905L6.99681 7.24996H7.91638Z"
                                                    clip-rule="evenodd" fill-rule="evenodd"></path>
                                            </svg>
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
                                                        <v-text-field label="Nombre de la planta*"
                                                            v-model="selectedProduct.nombre" required></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6" md="4">
                                                        <VTextField label="Precio*" v-model="selectedProduct.precio"
                                                            hint="añade el precio de la planta" required></VTextField>
                                                    </v-col>
                                                    <v-col cols="12" sm="6" md="4">
                                                        <v-text-field label="Img*" v-model="selectedProduct.fotos"
                                                            hint="añade el src de la foto" persistent-hint
                                                            required></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12">
                                                        <VTextField label="Descripción"
                                                            v-model="selectedProduct.descripcion"
                                                            hint="añade la descripción de la planta"></VTextField>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-text-field label="Stock*" v-model="selectedProduct.stock"
                                                            hint="añade la cantidad de Stock*" persistent-hint
                                                            required></v-text-field>
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
                                            <v-btn color="green" variant="text" @click="updateProductEditar(producto)">
                                                Guardar
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>

                                </v-dialog>
                            </v-row>
                            <!-- FIN EDITAR -->
                        </v-card>
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
import {
    getProductos, getTipos, updateProductStatus, updateAllProductsStatus,
    updateProductInDatabase, addProductInDatabase, verificarPedidosRelacionadosEnBaseDeDatos,
    eliminarProductoEnBaseDeDatos
} from './../services/connectionManager';




export default {
    data() {
        return {
            tipos: [],
            productos: [],
            name: "Layout",
            dialog: false,
            hayAlMenosUnProductoActivo: true,
            selectedProduct: [],
            selectedAddProduct: [],
            editDialogOpen: false,
            addDialogOpen: false,
        };
    },
    methods: {

        // VERIFICAR Y ELIMINAR
        async eliminarProducto(productId) {
            // Asigna la id del producto a selectedProduct
            this.selectedProduct = { id: productId };
            // Verificar si hay pedidos relacionados con el producto
            const hasRelatedOrders = await this.verificarPedidosRelacionados();

            if (hasRelatedOrders) {
                // No hay pedidos relacionados, eliminar el producto
                await this.eliminarProductoDeBaseDeDatos();
            } else {
                // Mostrar un mensaje si hay pedidos relacionados
                console.log('No se puede eliminar el producto, hay pedidos relacionados.');
            }
        },

        // VERIFICAR PRODUCTOS Y PEDIDOS
        async verificarPedidosRelacionados() {
            if (this.selectedProduct && this.selectedProduct.id) {
                const producto = this.productos.find(p => p.id === this.selectedProduct.id);
                if (producto) {
                    this.selectedProduct.id = producto.id;
                    //console.log('ID del producto seleccionado:', this.selectedProduct.id);
                    const hasRelatedOrders = await verificarPedidosRelacionadosEnBaseDeDatos(this.selectedProduct.id);
                    //console.log(hasRelatedOrders);
                    return hasRelatedOrders;
                } else {
                    console.error('Producto no encontrado');
                }
            } else {
                console.error('El producto seleccionado o su ID es nulo o indefinido');
            }
        },

        // ELIMINAR PRODUCTO
        async eliminarProductoDeBaseDeDatos() {
            const response = await eliminarProductoEnBaseDeDatos(this.selectedProduct.id);
            if (response) {
                // Elimina el producto de la lista de productos en tu componente
                const index = this.productos.findIndex((p) => p.id === this.selectedProduct.id);
                if (index !== -1) {
                    this.productos.splice(index, 1);
                    console.log('Producto eliminado');
                }

            } else {
                console.error('Error al eliminar el producto');
            }
        },

        // DIALOGO EDITAR
        openEditDialog(value) {
            this.editDialogOpen = value;
        },

        // DIALOGO AÑADIR
        openAddDialog(value) {
            this.selectedAddProduct = [];
            this.addDialogOpen = value;
        },

        // ADD PRODUCTO
        async addProduct() {
            const addProductData = { ...this.selectedAddProduct };
            //console.log(addProductData);

            try {
                const response = await addProductInDatabase(addProductData);

                if (response) {
                    // Actualiza la lista de productos después de la edición
                    const addedProduct = response;
                    this.productos.push(addedProduct);

                    // Cierra el formulario de edición
                    this.editDialogOpen = false;
                    this.getTotal();
                } else {
                    console.error('Error al agregar el producto');
                }
            } catch (error) {
                console.error('Error de red:', error);
            }

            // Cierra el formulario
            this.addDialogOpen = false;
        },

        // EDITAR PRODUCTO
        editProduct(productId) {
            const producto = this.productos.find(p => p.id === productId);

            if (producto) {
                // Muestra el formulario de edición y carga los datos del producto seleccionado
                this.selectedProduct = { ...producto };
                this.dialog = true;
            } else {
                console.error('Producto no encontrado');
            }
        },

        // EDITAR PRODUCTO
        async updateProductEditar() {
            const updatedProduct = this.selectedProduct;

            try {
                const response = await updateProductInDatabase(updatedProduct);

                if (response) {
                    // Actualiza la lista de productos después de la edición
                    const updatedProduct = response;
                    const index = this.productos.findIndex(p => p.id === updatedProduct.id);
                    if (index !== -1) {
                        this.productos.splice(index, 1, updatedProduct);
                    }

                    this.getTotal();
                } else {
                    console.error('Error al actualizar el producto');
                }
            } catch (error) {
                console.error('Error de red:', error);
            }

            // Cierra el formulario de edición
            this.dialog = false;
        },

        //BOTON
        async handleButtonClick() {
            if (this.isButtonDisabled) {
                return;
            }

            // Deshabilita el botón temporalmente
            this.isButtonDisabled = true;

            // Realiza la lógica de actualización
            await this.updateAllProductsStatus();

            // Habilita el botón nuevamente después de un tiempo (puedes ajustar el tiempo según tu necesidad)
            setTimeout(() => {
                this.isButtonDisabled = false;
            }, 1000);
        },

        // Productos activados
        async toggleProduct(producto) {
            const newStatus = !producto.isActive ? 1 : 0; // Toggle between 0 and 1

            // Validate that newStatus is either 0 or 1
            if (newStatus !== 0 && newStatus !== 1) {
                console.error('Invalid newStatus value. Please use 0 or 1.');
                return;
            }
            const success = await updateProductStatus(producto.id, newStatus);

            if (success) {
                const index = this.productos.findIndex(p => p.id === producto.id);
                this.productos.splice(index, 1, { ...producto, isActive: newStatus });
                this.updateHayAlMenosUnProductoActivo();
            }
        },

        updateHayAlMenosUnProductoActivo() {
            this.hayAlMenosUnProductoActivo = this.productos.some((producto) => producto.isActive);
        },

        // ACTUALIZAR TODOS LOS PRODUCTOS 
        async updateAllProductsStatus() {

            // Convierte el valor al nuevo estado
            const statusValue = this.hayAlMenosUnProductoActivo ? 0 : 1;

            // Validate that newStatus is either 0 or 1
            if (statusValue !== 0 && statusValue !== 1) {
                console.error('Invalid newStatus value. Please use 0 or 1.');
                return;
            }

            const success = await updateAllProductsStatus(statusValue);

            if (success) {
                this.productos.forEach((producto) => {
                    producto.isActive = statusValue === 1;
                });

                // Actualiza hayAlMenosUnProductoActivo al nuevo valor
                this.hayAlMenosUnProductoActivo = !this.hayAlMenosUnProductoActivo;
                console.log(this.hayAlMenosUnProductoActivo);
            }
        },

        getTotal() {
            // PRODUCTOS
            getProductos().then((response) => {
                this.productos = response.map((producto) => ({ ...producto }));
                //console.log(response);
            }).catch((error) => {
                console.error("Error al obtener productos: ", error);
            });

            // TIPOS DE PRODUCTOS
            getTipos().then((response) => {
                this.tipos = response;
                //console.log(response);
            }).catch((error) => {
                console.error("Error al obtener tipos: ", error);
            });

        },

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

<style scoped>
.btnEliminar {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1em;
    border: 0px solid transparent;
    background-color: rgba(100, 77, 237, 0.08);
    border-radius: 1.25em;
    transition: all 0.2s linear;
}

.btnEliminar:hover {
    box-shadow: 3.4px 2.5px 4.9px rgba(0, 0, 0, 0.025),
        8.6px 6.3px 12.4px rgba(0, 0, 0, 0.035),
        17.5px 12.8px 25.3px rgba(0, 0, 0, 0.045),
        36.1px 26.3px 52.2px rgba(0, 0, 0, 0.055),
        99px 72px 143px rgba(0, 0, 0, 0.08);
}

.tooltip {
    position: relative;
    display: inline-block;
}

.tooltip .tooltiptext {
    visibility: hidden;
    width: 4em;
    background-color: rgba(0, 0, 0, 0.253);
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    z-index: 1;
    top: 25%;
    left: 110%;
}

.tooltip .tooltiptext::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 100%;
    margin-top: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent rgba(0, 0, 0, 0.253) transparent transparent;
}

.tooltip:hover .tooltiptext {
    visibility: visible;
}

.custom-app-bar {
    padding: 10px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
}

.container {
    width: 100%;
    height: 100%;
    --s: 82px;
    --c1: #b2b2b2;
    --c2: #ffffff;
    --c3: #d9d9d9;

    --_g: var(--c3) 0 120deg, #0000 0;
    background: conic-gradient(from -60deg at 50% calc(100% / 3), var(--_g)),
        conic-gradient(from 120deg at 50% calc(200% / 3), var(--_g)),
        conic-gradient(from 60deg at calc(200% / 3),
            var(--c3) 60deg,
            var(--c2) 0 120deg,
            #0000 0),
        conic-gradient(from 180deg at calc(100% / 3), var(--c1) 60deg, var(--_g)),
        linear-gradient(90deg,
            var(--c1) calc(100% / 6),
            var(--c2) 0 50%,
            var(--c1) 0 calc(500% / 6),
            var(--c2) 0);
    background-size: calc(1.732 * var(--s)) var(--s);
}

/* Estilos para los productos */
.card {
    border-radius: 30px;
    background: #e0e0e0;
    position: relative;
    overflow: hidden;
    box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    margin: 20px;
}

.heading {
    border-radius: 30px;
    background: #ffffff;
    position: relative;
    overflow: hidden;
    box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #cacaca;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    margin: 20px;
}

.card::before {
    content: '';
    position: absolute;
    inset: 0;
    left: -5px;
    margin: auto;
    width: 200px;
    height: 264px;
    border-radius: 10px;
    background: linear-gradient(-45deg, #e81cff 0%, #40c9ff 100%);
    z-index: -10;
    pointer-events: none;
    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card::after {
    content: "";
    z-index: -1;
    position: absolute;
    inset: 0;
    background: linear-gradient(-45deg, #fc00ff 0%, #00dbde 100%);
    transform: translate3d(0, 0, 0) scale(0.95);
    filter: blur(20px);
}

/* Estilos para el botón de editar */
.btn-edit {
    padding: 12.5px 30px;
    border: 0;
    border-radius: 100px;
    background-color: #2ba8fb;
    color: white;
    border: none;
    font-weight: Bold;
    transition: all 0.5s;
    -webkit-transition: all 0.5s;
}

.btn-edit:hover {
    background-color: #6fc5ff;
    box-shadow: 0 0 20px #6fc5ff50;
    transform: scale(1.1);
}

button:active {
    background-color: #3d94cf;
    transition: all 0.25s;
    -webkit-transition: all 0.25s;
    box-shadow: none;
    transform: scale(0.98);
}

/* Estilos para el precio */
.preu {
    font-weight: bold;
    font-size: 16px;
    color: #2ba8fb;
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
