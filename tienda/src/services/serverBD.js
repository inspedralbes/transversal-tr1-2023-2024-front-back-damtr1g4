//Constantes requeridas de las dependencias
const mysql = require('mysql2');
const express = require('express');
const app = express();
const PORT = 3001;
const cors = require('cors');

//Datos para la con la base de datos de Pol
var con = mysql.createPool({
  host: "dam.inspedralbes.cat",
  user: "a22polazasot_users",
  password: "Contrasenya2004",
  database: "a22polazasot_baseTienda"
});

app.use(cors({
  origin: function (origin, callback) {
    return callback(null, true);
  }
}));

//Conexion con la base de datos
function connection() {
  con.getConnection(function (err) {
    if (err) throw err;
    else {
      console.log("Successful connection!!");

    }
  });
}

//Consulta para recoger productes
function querieProductos() {
  return new Promise((resolve, reject) => {
    connection();
    var sql = "SELECT * FROM productes;";
    con.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      else {
        resolve(result);
      }

    });
  });

}

//Consulta para recoger tipos
function querieTipos() {
  return new Promise((resolve, reject) => {
    connection();
    var sql = "SELECT * FROM tipos;";
    con.query(sql, function (err, result) {
      if (err) {
        reject(err);
      }
      else {
        resolve(result);
      }

    });
  });
}

// !ACTIVO (modificar de 1 en 1)
function updateProductStatus(id, isActive) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE productes SET isActive = ? WHERE id = ?';

    con.query(sql, [isActive, id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// Modificar todos de golpe (MARIA)
function updateProductStatusTotal(isActive) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE productes SET isActive = ? WHERE tipo_id = 1';

    con.query(sql, [isActive], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// Modificar todos de golpe (HACHIS)
function updateProductStatusTotalHachis(isActive) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE productes SET isActive = ? WHERE tipo_id = 2';

    con.query(sql, [isActive], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}


// Modificar todos de golpe (ACCESORIOS)
function updateProductStatusTotalAccesorios(isActive) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE productes SET isActive = ? WHERE tipo_id = 3';

    con.query(sql, [isActive], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// Edita algun producto
function editarProducto(updatedProduct) {
  return new Promise((resolve, reject) => {
    // Valores para la consulta SQL
    const values = [
      updatedProduct.nombre,
      updatedProduct.precio,
      updatedProduct.descripcion,
      updatedProduct.fotos,
      updatedProduct.stock,
      updatedProduct.id,
    ];

    const sql = 'UPDATE productes SET nombre = ?, precio = ?, descripcion = ?, fotos = ?, stock = ? WHERE id = ?';

    con.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(updatedProduct);
      }
    });
  });
}

// añadir un producto MARIA
function addProducto(addProduct) {
  return new Promise((resolve, reject) => {
    // Valores para la consulta SQL
    const values = [
      addProduct.nombre,
      addProduct.precio,
      addProduct.descripcion,
      addProduct.fotos,
      addProduct.stock,
      addProduct.id,
    ];

    console.log(addProduct);
    const sql = 'INSERT INTO productes (nombre, precio, descripcion, tipo_id, tienda_id, fotos, stock, isActive) VALUES (?, ?, ?, 1, 1, ?, ?, true)';

    con.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(addProduct);
      }
    });
  });
}

// añadir un producto HACHIS
function addProductoHachis(addProduct) {
  return new Promise((resolve, reject) => {
    // Valores para la consulta SQL
    const values = [
      addProduct.nombre,
      addProduct.precio,
      addProduct.descripcion,
      addProduct.fotos,
      addProduct.stock,
      addProduct.id,
    ];

    console.log(addProduct);
    const sql = 'INSERT INTO productes (nombre, precio, descripcion, tipo_id, tienda_id, fotos, stock, isActive) VALUES (?, ?, ?, 2, 1, ?, ?, true)';

    con.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(addProduct);
      }
    });
  });
}

// añadir un producto ACCESORIOS
function addProductoAccesorios(addProduct) {
  return new Promise((resolve, reject) => {
    // Valores para la consulta SQL
    const values = [
      addProduct.nombre,
      addProduct.precio,
      addProduct.descripcion,
      addProduct.fotos,
      addProduct.stock,
      addProduct.id,
    ];

    console.log(addProduct);
    const sql = 'INSERT INTO productes (nombre, precio, descripcion, tipo_id, tienda_id, fotos, stock, isActive) VALUES (?, ?, ?, 3, 1, ?, ?, true)';

    con.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(addProduct);
      }
    });
  });
}

// VERIFICAR PEDIDOS RELACIONADOS
function verificarPedidosRelacionadosEnBaseDeDatos(productId) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) AS count FROM comandes_productes WHERE id_producte = ?';
    con.query(sql, [productId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        const count = result[0].count;
        //console.log(`Count: ${count}`);
        if (count > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    });
  });
}

// Eliminar un producto
function eliminarProducto(productId) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM productes WHERE id = ?';

    con.query(sql, [productId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

//Conexcion con el servidor
app.listen(PORT, () => {
  console.log("Server  =>" + PORT);
});

// GET PRODUCTES
app.get("/getProductes", (req, res) => {
  querieProductos()
    .then((data) => {
      const productes = data;

      JSON.stringify(productes);
      res.json(productes);
    })
    .catch((err) => {
      console.log(err);
    })
})

// GET TIPOS
app.get("/getTipos", (req, res) => {
  querieTipos()
    .then((data) => {
      const productes = data;

      JSON.stringify(productes);
      res.json(productes);
    })
    .catch((err) => {
      console.log(err);
    })
})

app.use(express.json());
// Ruta para actualizar productos activados
app.put('/updateProductStatus', (req, res) => {
  const { id, isActive } = req.body;

  updateProductStatus(id, isActive)
    .then((result) => {
      res.status(200).json({ message: 'Product status updated successfully' });
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to update product status' });
    });
});

// actualizar todos los productos de golpe (MARIA) 
app.put('/updateAllProductsStatus', (req, res) => {
  const { isActive } = req.body;

  updateProductStatusTotal(isActive)
    .then((result) => {
      res.status(200).json({ message: 'Product status updated successfully' });
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to update product status' });
    });
});

// actualizar todos los productos de golpe (HACHIS) 
app.put('/updateAllProductsStatusHachis', (req, res) => {
  const { isActive } = req.body;

  updateProductStatusTotalHachis(isActive)
    .then((result) => {
      res.status(200).json({ message: 'Product status updated successfully' });
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to update product status' });
    });
});

// actualizar todos los productos de golpe (ACCESORIOS) 
app.put('/updateAllProductsStatusAccesorios', (req, res) => {
  const { isActive } = req.body;

  updateProductStatusTotalAccesorios(isActive)
    .then((result) => {
      res.status(200).json({ message: 'Product status updated successfully' });
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to update product status' });
    });
});

// Ruta para actualizar un producto
app.post('/updateProduct', (req, res) => {
  const updatedProduct = req.body;

  editarProducto(updatedProduct)
    .then((updatedProduct) => {
      //console.log(updatedProduct);
      res.json(updatedProduct);
    })
    .catch((error) => {
      console.error('Error al actualizar el producto en la base de datos:', error);
      res.status(500).json({ error: 'Error al actualizar el producto' });
    });
});

// Ruta para actualizar MARIA
app.post('/addProduct', (req, res) => {
  const addProduct = req.body;

  addProducto(addProduct)
    .then((addProduct) => {
      //console.log(addProduct);
      res.json(addProduct);

    })
    .catch((error) => {
      console.error('Error al añadir el producto en la base de datos:', error);
      res.status(500).json({ error: 'Error al añadir el producto' });
    });
});

// Ruta para actualizar Hachis
app.post('/addProductHachis', (req, res) => {
  const addProduct = req.body;

  addProductoHachis(addProduct)
    .then((addProduct) => {
      //console.log(addProduct);
      res.json(addProduct);

    })
    .catch((error) => {
      console.error('Error al añadir el producto en la base de datos:', error);
      res.status(500).json({ error: 'Error al añadir el producto' });
    });
});

// Ruta para actualizar ACCESORIOS
app.post('/addProductAccesorios', (req, res) => {
  const addProduct = req.body;

  addProductoAccesorios(addProduct)
    .then((addProduct) => {
      //console.log(addProduct);
      res.json(addProduct);

    })
    .catch((error) => {
      console.error('Error al añadir el producto en la base de datos:', error);
      res.status(500).json({ error: 'Error al añadir el producto' });
    });
});

// Ruta para verificar si se puede eliminar un producto
app.post('/verificarProducto', (req, res) => {
  const productId = req.body.productId;

  //console.log(`ID del producto a verificar: ${productId}`);

  verificarPedidosRelacionadosEnBaseDeDatos(productId)
    .then((tienePedidosRelacionados) => {
     //console.log(`tienePedidosRelacionados: ${tienePedidosRelacionados}`);
      let puedeEliminar;
      if (tienePedidosRelacionados) {
        puedeEliminar = false;
        res.json({ puedeEliminar: false });
      } else {
        puedeEliminar = true;
        res.json({ puedeEliminar: true });
      }
    })
    .catch((error) => {
      console.error('Error al verificar pedidos relacionados en la base de datos:', error);
      res.status(500).json({ error: 'Error al verificar pedidos relacionados' });
    });
});

// Ruta para eliminar un producto
app.post('/eliminarProducto', (req, res) => {
  const productId = req.body.productId;

  eliminarProducto(productId)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Error al eliminar el producto en la base de datos:', error);
      res.status(500).json({ error: 'Error al eliminar el producto' });
    });
});