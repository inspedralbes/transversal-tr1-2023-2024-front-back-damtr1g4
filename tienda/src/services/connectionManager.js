const BASE_URL = "http://takeaway4.dam.inspedralbes.cat:3777";

// PRODUCTOS
export async function getProductos() {
    const response = await fetch(BASE_URL + '/getProductes');
    const result = await response.json();
    return result;
}

// TIPOS
export async function getTipos() {
    const response = await fetch(BASE_URL + '/getTipos');
    const result = await response.json();
    return result;
}

// PRODUCTOS !ACTIVOS
export async function updateProductStatus(id, isActive) {
    if (isActive !== 0 && isActive !== 1) {
        console.error('Invalid isActive value. Please use 0 or 1.');
        return false;
    }

    try {
        const response = await fetch(BASE_URL + "/updateProductStatus", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                isActive: isActive,
            }),
        });

        if (response.status === 200) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Failed to update product status:', error);
        return false;
    }
}


// PRODUCTOS !ACTIVOS (TODOS) MARIA
export async function updateAllProductsStatus(isActive) {
    if (isActive !== 0 && isActive !== 1) {
        console.error('Invalid isActive value. Please use 0 or 1.');
        return false;
    }

    try {
        const response = await fetch(BASE_URL + "/updateAllProductsStatus", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                isActive: isActive,
            }),
        });

        if (response.status === 200) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Failed to update product status:', error);
        return false;
    }
}

// PRODUCTOS !ACTIVOS (TODOS) HACHIS  
export async function updateAllProductsStatusHachis(isActive) {
    if (isActive !== 0 && isActive !== 1) {
        console.error('Invalid isActive value. Please use 0 or 1.');
        return false;
    }

    try {
        const response = await fetch(BASE_URL + "/updateAllProductsStatusHachis", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                isActive: isActive,
            }),
        });

        if (response.status === 200) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Failed to update product status:', error);
        return false;
    }
}

// PRODUCTOS !ACTIVOS (TODOS) ACCESORIOS  
export async function updateAllProductsStatusAccesorios(isActive) {
    if (isActive !== 0 && isActive !== 1) {
        console.error('Invalid isActive value. Please use 0 or 1.');
        return false;
    }

    try {
        const response = await fetch(BASE_URL + "/updateAllProductsStatusAccesorios", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                isActive: isActive,
            }),
        });

        if (response.status === 200) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Failed to update product status:', error);
        return false;
    }
}

// PRODUCTOS (EDITAR)
export async function updateProductInDatabase(updatedProduct) {

    try {
        const response = await fetch(BASE_URL + '/updateProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProduct),
        });

        if (response.status === 200) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
}

// PRODUCTOS (AÑADIR) MARIA
export async function addProductInDatabase(addProduct) {

    try {
        const response = await fetch(BASE_URL + '/addProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(addProduct),
        });

        if (response.status === 200) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
}

// PRODUCTOS (AÑADIR) HACHIS
export async function addProductInDatabaseHachis(addProduct) {

    try {
        const response = await fetch(BASE_URL + '/addProductHachis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(addProduct),
        });

        if (response.status === 200) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
}

// PRODUCTOS (AÑADIR) ACCESORIOS 
export async function addProductInDatabaseAccesorios(addProduct) {

    try {
        const response = await fetch(BASE_URL + '/addProductAccesorios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(addProduct),
        });

        if (response.status === 200) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
}

// VERIFICAR PRODUCTOS Y PEDIDOS
export async function verificarPedidosRelacionadosEnBaseDeDatos(productId) {
    try {
        const response = await fetch(BASE_URL + '/verificarProducto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId }),
        });

        if (response.status === 200) {
            const data = await response.json();
            return data.puedeEliminar;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
}

// Eliminar un producto de la base de datos
export async function eliminarProductoEnBaseDeDatos(productId) {
    try {
        const response = await fetch(BASE_URL + '/eliminarProducto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId }),
        });

        if (response.status === 200) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error de red:', error);
        return false;
    }
}

// Pedir comandes
export async function getComandes(){
    const response= await fetch(BASE_URL + `/getComandes`);
    const result = await response.json();
    return result;
 }

export async function archivarComanda(comanda_id) {
    try {
        const response = await fetch(BASE_URL + '/archivarComanda', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ comanda_id }),
        });

        if (response.status === 200) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error de red:', error);
        return false;
    }
}
