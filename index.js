//Constantes requeridas de las dependencias
const mysql = require('mysql2');
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
var cors = require("cors");
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
//Datos para la conexion a la base de datos de Pol
const pool = mysql.createPool({
    connectionLimit: 10, // ajusta según tus necesidades
    host: "dam.inspedralbes.cat",
    user: "a22polazasot_users",
    password: "Contrasenya2004",
    database: "a22polazasot_baseTienda"
});
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
        var sql = "SELECT nom_usuari, cognoms_usuari, contrasenya, correu_electronic, numero_targeta, data_caducitat, cvv FROM usuaris WHERE nom_usuari = ?;";
        connection.execute(sql, [nom_usuari], function (err, result) { // Pasa nom_usuari como argumento en la consulta SQL
            if (err) {
                reject(err);
            } else {
                connection.release();
                console.log(result);
                resolve(result);
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
//Consulta para recoger todos los datos
function GetProducts() {
    return new Promise(async(resolve, reject) => {
        const connection = await GetConnection();
        var sql = "SELECT * FROM productes;";
        connection.execute(sql, function (err, result) {
            
            if (err) {
                reject(err);
            }
            else {
                connection.release();
                resolve(result);
            }

        });
    });

}
//Consulta para recoger los tipos de productos
function GetTipos(){
    return new Promise(async(resolve, reject) => {
        const connection = await GetConnection();
        var sql = "SELECT * FROM tipos;"
        connection.execute(sql, function (err, result) {
            if(err){
                console.log(err);
            }
            else{
                connection.release();
                resolve(result);
            }
        });
    })
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
//Recogemos la imagen que se añade del producto nuevo y la almacenamos en un fichero
function saveImage(fotos){
    const nombreArchivo = path.basename(fotos);
    const subdirectori = "Images";
    const directori = path.join(__dirname, subdirectori);
    fs.mkdir(directori, (error) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Directorio creado con éxito');
        }
    });
    const ruta = path.join(directori,nombreArchivo);
    fs.copyFile(nombreArchivo,ruta,(err) => {
        if(err){
            console.log(err.message);
        }
        else{
            console.log("Saved image");
        }
    });
    
}
function deleteImage(fotos){

}
//Conexcion con el servidor
app.listen(PORT, () => {
    console.log("Server  =>" + PORT);
});
//Verificamos que el usuario este en la base de datos y devolvemos un booleano en formato Json
app.post("/verify", (req, res) => {
    const { nom_usuari, contrasenya } = req.body;
    let verify = false;
    GetUsuarios(nom_usuari) // Pasa el nombre de usuario como argumento
        .then((data) => {
            const usuarios = data;
            const user = usuarios.find(u => u.nom_usuari === nom_usuari && u.contrasenya === contrasenya);
            if (user) {
                verify = true;
            }
            console.log(verify);
            res.json({ verify });
        })
        .catch((err) => {
            console.log(err);
        });
});
app.get("/getUsuarios", (req, res) => {
    const user = req.query.user; // Obtener el valor de nombreUsuario de los parámetros de consulta

    if (!user) {
        return res.status(400).json({ error: "El parámetro nombreUsuario es obligatorio." });
    }

    GetUsuarios(user) // Llama a GetUsuarios con el nombre de usuario proporcionado
        .then((data) => {
            const usuarios = data;
            res.json(usuarios);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Error al obtener usuarios" });
        });
});
//Recogemos los tipos de productos que ofrecemos
app.get("/getTipos", (req, res) => {
    GetTipos()
    .then((data) => {
        const tipos = data;
        res.json(tipos);
    })
    .catch((err) => {
        console.log(err);
    });
})
//Recogemos los productos de nuestra base de datos
app.get("/getProductes", (req, res) => {
    GetProducts()
        .then((data) => {
            const productes = data;
            res.json(productes);
        })
        .catch((err) => {
            console.log(err);
        })
});
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