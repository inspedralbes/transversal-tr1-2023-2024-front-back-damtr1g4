<template>
    <v-layout class="rounded rounded-md" :align="'center'">

        <v-app-bar :elevation="24">
            <v-row>
                <v-dialog v-model="editDialogOpen" persistent width="1024">
                    <template v-slot:activator="{ props }">
                        <v-btn class="mr-4" elevation="6" large v-bind="props" @click="openEditDialog(true)">
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
                            <v-btn color="green" variant="text" @click="openEditDialog(false)">
                                Cerrar
                            </v-btn>
                            <v-btn color="green" variant="text" @click="addProduct()">
                                Añadir
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
            <template v-slot:append>
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
                    <v-card width="400" height="635" :class="'card'">
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
                        <v-card-title class="nom">{{ producto.nombre }}</v-card-title><!-- class="text-center" -->
                        <v-card-text class="preu">{{ producto.precio }}€</v-card-text>
                        <v-card-text class="dispo">Stock: {{ producto.stock }}</v-card-text>
                        <!-- EDITAR -->
                        <v-row justify="center">
                            <v-dialog v-model="dialog" persistent width="1024">
                                <template v-slot:activator="{ props }">
                                    <v-btn elevation="6" width="90" class="mr-4" v-bind="props"
                                        @click="editProduct(producto.id)">
                                        Editar
                                    </v-btn>
                                    <v-btn elevation="6" width="90" @click="eliminarProducto()">Eliminar</v-btn>
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
                                                    <VTextField label="Descripción" v-model="selectedProduct.descripcion"
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
import { updateProductStatus } from './../services/connectionManager';
import { updateAllProductsStatus } from './../services/connectionManager';
import { updateProductInDatabase } from './../services/connectionManager';
import { addProductInDatabase } from './../services/connectionManager';
import { verificarPedidosRelacionadosEnBaseDeDatos } from './../services/connectionManager';
import { eliminarProductoEnBaseDeDatos } from './../services/connectionManager';



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
        };
    },
    methods: {

        // VERIFICAR Y ELIMINAR
        async eliminarProducto() {
            // Verificar si hay pedidos relacionados con el producto
            const hasRelatedOrders = await this.verificarPedidosRelacionados();

            if (!hasRelatedOrders) {
                // No hay pedidos relacionados, eliminar el producto
                await this.eliminarProductoDeBaseDeDatos();
            } else {
                // Mostrar un mensaje si hay pedidos relacionados
                console.log('No se puede eliminar el producto, hay pedidos relacionados.');
            }
        },

        // VERIFICAR PRODUCTOS Y PEDIDOS
        async verificarPedidosRelacionados() {
            const response = await verificarPedidosRelacionadosEnBaseDeDatos(this.selectedProduct.id);
            return response;
        },

        // ELIMINAR PRODUCTO
        async eliminarProductoDeBaseDeDatos() {
            const response = await eliminarProductoEnBaseDeDatos(this.selectedProduct.id);

            if (response) {
                // Elimina el producto de la lista de productos en tu componente
                const index = this.productos.findIndex((p) => p.id === this.selectedProduct.id);
                if (index !== -1) {
                    this.productos.splice(index, 1);
                }

            } else {
                console.error('Error al eliminar el producto');
            }
        },

        // DIALOGO AÑADIR
        openEditDialog(value) {
            this.editDialogOpen = value;
        },

        // ADD PRODUCTO
        async addProduct() {
            const addProductData = { ...this.selectedAddProduct };
            console.log(addProductData);

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
                    // Cierra el formulario de edición
                    this.dialog = false;
                    this.getTotal();
                } else {
                    console.error('Error al actualizar el producto');
                }
            } catch (error) {
                console.error('Error de red:', error);
            }
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
                console.log(response);
            }).catch((error) => {
                console.error("Error al obtener productos: ", error);
            });

            // TIPOS DE PRODUCTOS
            getTipos().then((response) => {
                this.tipos = response;
                console.log(response);
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

<style>
.card {
    width: 190px;
    height: 254px;
    border-radius: 30px;
    background: #e0e0e0;
    box-shadow: 15px 15px 30px #bebebe,
        -15px -15px 30px #ffffff;
}

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