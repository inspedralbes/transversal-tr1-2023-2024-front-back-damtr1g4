const express = require("express");
var mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors({
    origin: function(origin, callback){
        return callback(null, true); 
    }
}));

var pool = mysql.createPool({
    host: "dam.inspedralbes.cat",
    user: "a22polazasot_users",
    password: "Contrasenya2004",
    database: "a22polazasot_baseTienda"
});

app.get("/getComandes", (req, res) => {
    pool.getConnection(function(err, con) {
        if (err) throw err;
        console.log("Connected!");

        let sql = "SELECT c.id_comanda, c.id_usuari, cp.id_producte, cp.quantitat FROM comandes c LEFT JOIN comandes_productes cp ON c.id_comanda = cp.id_comanda";
        con.query(sql, function (err, result, fields) {
            con.release();
            if (err) throw err;
            else{
                // Agrupar resultats per id_comanda i id_usuari
                let comandes = {};
                for (let row of result) {
                    let key = `${row.id_comanda}-${row.id_usuari}`;
                    if (!comandes[key]) {
                        // Copiar les propietats de id_comanda i id_usuari
                        comandes[key] = {id_comanda: row.id_comanda, id_usuari: row.id_usuari, productes: []};
                    }
                    if (row.id_producte !== null && row.quantitat !== null) {
                        // Afegir els productes al array de productes de la comanda
                        comandes[key].productes.push({id_producte: row.id_producte, quantitat: row.quantitat});
                    }
                }

                // comandes object a array
                let comandesArray = Object.values(comandes);

                res.send(comandesArray);
            }
        });
    });
});

//RUN
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});