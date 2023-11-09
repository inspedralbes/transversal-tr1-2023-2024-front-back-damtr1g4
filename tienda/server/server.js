const mysql = require('mysql2');
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
var cors = require("cors");
const socketIO = require('socket.io');
const http = require('http');
const { spawn } = require('child_process');

//Puerto de conexion
const PORT = 3777;


const httpServer = http.createServer(app);

const io = socketIO(httpServer, {
  cors: {
    origin: "*", // permite todas las solicitudes
    methods: ["GET", "POST"]
  }
});

// CORS
app.get('/',(req,res) =>{
  res.sendFile(path.join("/home/a22jonmarqui/web/takeaway4.dam.inspedralbes.cat/public_html", 'index.html'));
});
app.use(cors({
  origin: function (origin, callback) {
    return callback(null, true);
  }
}));

app.use(express.static(path.join("/home/a22jonmarqui/web/takeaway4.dam.inspedralbes.cat/public_html")));
app.use(bodyParser.json());

//Datos para la conexion a la base de datos
const pool = mysql.createPool({
    host: "dam.inspedralbes.cat",
    user: "a22polazasot_users",
    password: "Contrasenya2004",
    database: "a22polazasot_baseTienda"
});

function executePythonScript() {
  return new Promise((resolve, reject) => {
    const python = spawn('python', ['stats.py']); // replace with your Python script path

    python.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    python.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    python.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        resolve();
    });

    python.on('error', (error) => {
        console.error(`spawn error: ${error}`);
        reject();
    });
  });
}

function saveImage() {
  // Define the path to your folder
  const folderPath = "./grafics";

  // Check if the folder exists
  if (!fs.existsSync(folderPath)) {
    // If the folder doesn't exist, create it
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // Read the image file
  const image = fs.readFileSync(folderPath + '/RecaudacioPerDates.png'); // replace with your image path

  // Write the image file to your desired location
  fs.writeFileSync(path.join(folderPath, '/RecaudacioPerDates.png'), image);
}

function runPeriodically() {
  setInterval(() => {
      executePythonScript().then(saveImage).catch(console.error);
  }, 1000 * 10); // replace with your desired interval (in milliseconds)
}

runPeriodically();

//Conexion con la base de datos
function GetConnection() {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                resolve(connection);
            }
        });
    });
}

//Usuarios
function GetUsuarios(nom_usuari) {
    return new Promise(async (resolve, reject) => {
        const connection = await GetConnection();
        var sql = "SELECT id, nom_usuari, cognoms_usuari, contrasenya, correu_electronic, numero_targeta, data_caducitat, cvv FROM usuaris WHERE nom_usuari = ?;";
        connection.execute(sql, [nom_usuari], function (err, result) { // Pasa nom_usuari como argumento en la consulta SQL
            if (err) {
                reject(err);
            } else {
                connection.release();
                console.log(result);
                //Dado que nom_usuari es único, solo debe haber un resultado
                resolve(result[0]);
            }
        });
    });
}
//Realizamos inserts de los productos
function InsertProducts(nombre, precio, descripcion, tipo_id, tienda_id, fotos, stock) {
    return new Promise(async(resolve, reject) => {
        const connection = await GetConnection();
        var sql = "INSERT INTO productes (nombre, precio, descripcion, tipo_id, tienda_id, fotos, stock) VALUES ('"+nombre+"', "+precio+", '"+descripcion+"', "+tipo_id+", "+tienda_id+", '"+fotos+"', "+stock+");";
        connection.execute(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            else {
                connection.release();
                resolve(result);
                console.log("1 record inserted");
            }
        });
    });
}
//Realizamos updates de los productes con su id
function UpdateProducts(id, nombre, precio, descripcion, tipo_id, tienda_id, fotos, stock) {
    return new Promise(async(resolve, reject) => {
        const connection = await GetConnection();
        var sql = "UPDATE productes SET nombre = '"+nombre+"', precio = "+precio+", descripcion = '"+descripcion+"', tipo_id = "+tipo_id+", tienda_id = "+tienda_id+", fotos = '"+fotos+"', stock = "+stock+" WHERE id = "+id+";";
        connection.execute(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            else {
                connection.release()
                resolve(result);
                console.log("1 record update");
            }
        });
    });
}

//Consulta para recoger productes
function querieProductos() {
  return new Promise((resolve, reject) => {
    GetConnection();
    var sql = "SELECT * FROM productes;";
    pool.query(sql, function (err, result) {
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
    GetConnection();
    var sql = "SELECT * FROM tipos;";
    pool.query(sql, function (err, result) {
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

    pool.query(sql, [isActive, id], (err, result) => {
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

    pool.query(sql, [isActive], (err, result) => {
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

    pool.query(sql, [isActive], (err, result) => {
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

    pool.query(sql, [isActive], (err, result) => {
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

    pool.query(sql, values, (err, result) => {
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

    pool.query(sql, values, (err, result) => {
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

    pool.query(sql, values, (err, result) => {
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

    pool.query(sql, values, (err, result) => {
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
    pool.query(sql, [productId], (err, result) => {
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

    pool.query(sql, [productId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// Obtener comandas
function obtenerComandas() {
  return new Promise((resolve, reject) => {
    const sql = `
        SELECT c.id_comanda, c.id_usuari, c.preu, c.data, c.hora, cp.id_producte, cp.quantitat
        FROM comandes c
        LEFT JOIN comandes_productes cp ON c.id_comanda = cp.id_comanda WHERE finalitzada = false
    `;

    pool.query(sql, (err, result) => {
      if (err) {
        reject(err);
      } else {
        const comandes = {};
        result.forEach((row) => {
          const key = `${row.id_comanda}-${row.id_usuari}`;
          if (!comandes[key]) {
            comandes[key] = { 
              id_comanda: row.id_comanda, 
              id_usuari: row.id_usuari, 
              preu: row.preu, 
              data: formatFecha(row.data), // Formatear la fecha
              hora: row.hora,
              productes: [] };
          }
          if (row.id_producte !== null && row.quantitat !== null) {
            comandes[key].productes.push({ id_producte: row.id_producte, quantitat: row.quantitat });
          }
        });

        const comandesArray = Object.values(comandes);
        resolve(comandesArray);
      }
    });
  });
}

// Función para formatear la fecha
function formatFecha(fecha) {
  const date = new Date(fecha);
  const dia = date.getDate();
  const mes = date.getMonth() + 1; // Sumar 1 al mes porque en JavaScript los meses empiezan en 0
  const año = date.getFullYear();
  return `${dia}-${mes}-${año}`;
}

function DeleteProduct(id) {
    return new Promise(async(resolve, reject) => {
        const connection = await GetConnection();
        var sql = "DELETE FROM productes WHERE id = "+id+";";
        connection.execute(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            else {
                connection.release();//libera la conexión después de obtener los resultados
                resolve(result);
            }

        });
    });
}
// Cerramos el pool de conexiones cuando la aplicación se detenga
process.on('SIGINT', () => {
    pool.end((err) => {
        if (err) {
            console.error("Error al cerrar el pool de conexiones:", err.message);
        } else {
            console.log("Se cerró el pool de conexiones.");
        }
        process.exit();
    });
});

//Verificamos que el usuario este en la base de datos y devolvemos un booleano en formato Json
app.post("/verify", (req, res) => {
    const { nom_usuari, contrasenya } = req.body;
    let verify = false;
    sql = "SELECT * FROM usuaris WHERE nom_usuari = ? AND contrasenya = ?;";
    pool.query(sql, [nom_usuari, contrasenya], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            if (result.length > 0) {
                verify = true;
            }
            res.json({ verify });
        }
    });
});
app.get("/getUsuarios", (req, res) => {
    const user = req.query.user; // Obtener el valor de nombreUsuario de los parámetros de consulta

    if (!user) {
        return res.status(400).json({ error: "El parámetro nombreUsuario es obligatorio." });
    }

    GetUsuarios(user) // Llama a GetUsuarios con el nombre de usuario proporcionado
        .then((data) => {
            const usuario = data;
            res.json(usuario);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Error al obtener usuarios" });
        });
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

//Añadimos un producto nuevo a la base de datos
app.post("/postProductes", (req, res) => {
    const productObject = req.body;
    console.log(productObject);
    const nombre = productObject.nombre;
    const precio = productObject.precio;
    const descripcion = productObject.descripcion;
    const tipo_id = productObject.tipo_id;
    const tienda_id = productObject.tienda_id;
    const fotos = productObject.fotos;
    const stock = productObject.stock;

    InsertProducts(nombre, precio, descripcion, tipo_id, tienda_id, fotos, stock);
    saveImage(fotos);
    res.json(productObject);
});
//Eliminamos un producto seleccionando su id
app.delete("/delete/:id",(req ,res) =>{
    const idSelected = parseInt(req.params.id);
    DeleteProduct(idSelected);
});
//Modificamos un producto seleccionando su id
app.put("/putProductes/:id",(req, res) => {
    const idSelected = parseInt(req.params.id);
    const productObject = req.body;
    console.log(productObject);
    const nombre = productObject.nombre;
    const precio = productObject.precio;
    const descripcion = productObject.descripcion;
    const tipo_id = productObject.tipo_id;
    const tienda_id = productObject.tienda_id;
    const fotos = productObject.fotos;
    const stock = productObject.stock;

    UpdateProducts(idSelected, nombre, precio, descripcion, tipo_id, tienda_id, fotos, stock);
    res.json(productObject);
});

function enviarComanda(comandaObject){
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO comandes (id_usuari, preu, data, hora) VALUES ("+comandaObject.id_usuari+", "+comandaObject.preu+", '"+comandaObject.data+"', '"+comandaObject.hora+"');";
    const params = [comandaObject.id_usuari, comandaObject.preu, comandaObject.data, comandaObject.hora];
    pool.query(sql, params, (err, result) => {
        if(err){
            console.log(err);
            reject(err);
        }
        else{
            const idComanda = result.insertId;
            comandaObject.id_comanda = idComanda;
            comandaObject.productes.forEach(producte => {
                const sqlProducte = "INSERT INTO comandes_productes (id_comanda, id_producte, quantitat) VALUES ("+idComanda+", "+producte.id+", 1);";
                const paramsProducte = [idComanda, producte.id, 1];
                pool.query(sqlProducte, paramsProducte, (err, result) => {
                    if(err){
                        console.log(err);
                        reject(err);
                    }
                    else{
                        console.log("Comanda insertada");
                        resolve();
                    }
                });
            });
        }
    });
  });
}


//Insertamos una comanda nueva
app.post("/sendComanda", (req, res) => {
    const comandaObject = req.body;
    enviarComanda(comandaObject)
    .then(() => {
      console.log(comandaObject);
      io.emit('novaComanda', comandaObject);
      res.status(200).send();
    })
    .catch((err) => {
      console.log(err);
    });
});

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

// Ruta para obtener comandas
app.get("/getComandes", (req, res) => {
  obtenerComandas()
    .then((comandasArray) => {
      res.send(comandasArray);
    })
    .catch((error) => {
      console.error("Error al obtener comandas desde la base de datos:", error);
      res.status(500).json({ error: "Error al obtener comandas" });
    });
});

function archivarComanda(comanda_id){
  return new Promise((resolve, reject) => {
    var sql = "UPDATE comandes SET finalitzada = true WHERE id_comanda = ?";
    console.log(comanda_id);

    pool.query(sql, [comanda_id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

app.put("/archivarComanda",(req ,res) =>{
    const comanda_id = req.body.comanda_id;
    archivarComanda(comanda_id)
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      console.log(err);
    });
});


//Conexcion con el servidor
httpServer.listen(PORT, () => {
  console.log("Server  =>" + PORT);
});