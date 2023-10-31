// PRODUCTOS
export async function getProductos() {
    const response = await fetch('http://localhost:3001/getProductes');
    const result = await response.json();
    return result;
}

// TIPOS
export async function getTipos() {
    const response = await fetch('http://localhost:3001/getTipos');
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
        const response = await fetch("http://localhost:3001/updateProductStatus", {
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


// PRODUCTOS !ACTIVOS (TODOS)
export async function updateAllProductsStatus(isActive) {
    if (isActive !== 0 && isActive !== 1) {
        console.error('Invalid isActive value. Please use 0 or 1.');
        return false;
    }

    try {
        const response = await fetch("http://localhost:3001/updateAllProductsStatus", {
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
        const response = await fetch('http://localhost:3001/updateProduct', {
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

// PRODUCTOS (AÑADIR)
export async function addProductInDatabase(addProduct) {

    try {
        const response = await fetch('http://localhost:3001/addProduct', {
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

// VERIFICAR PEDIDOS RELACIONADOS
export async function verificarPedidosRelacionadosEnBaseDeDatos(productId) {
    try {
        const response = await fetch('http://localhost:3001/verificarProducto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId }),
        });

        if (response.status === 200) {

            const data = await response.json();
            return data.puedeEliminar === true;
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
        const response = await fetch('http://localhost:3001/eliminarProducto', {
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

