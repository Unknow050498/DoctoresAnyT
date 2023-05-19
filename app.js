const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const port = 3000;

app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'doctoresat'
});

connection.connect((err) => {
    if(err){
        console.error('No se puede conectar a la Base de Datos', err);
        return;
    }
    console.log('Conexión establecida a la Base de Datos');
});

app.get('/px', (req, res) => {
    connection.query('SELECT * FROM pacientes', (err, results) => {
        if(err){
            console.error('Error al registrar');
            res.status(500).send('Error al registrar');
            return ;
        }
        res.json(results);
    });
});

app.get('/px/:id', (req, res) => {
    const {id} = req.params;
    connection.query('SELECT * FROM pacientes WHERE id = ?', [id], (err, results) => {
        if(err) throw err;
        res.send(results[0]);
    });
});

app.post('/px', (req, res) => {
    const nombre = req.body;
    const paterno = req.body;
    const materno = req.body;
    connection.query('INSERT INTO pacientes SET ?', [nombre, paterno, materno], (err, results) => {
        if(err) throw err;
        res.send('Paciente creado');
    });
});

app.put('/px/:id', (req, res) => {
    const {id} = req.params;
    const nombre = req.body;
    const paterno = req.body;
    const materno = req.body;
    connection.query('UPDATE pacientes SET ?, ?, ? WHERE id = ?', [nombre, paterno, materno, id], (err, results) => {
        if(err) throw err;
        res.send('Paciente modificado');
    });
});

app.delete('/px/:id', (req, res) => {
    const {id} = req.params;
    connection.query('DELETE FROM pacientes WHERE id = ?', [id], (err, results) => {
        if(err) throw err;
        res.send('Paciente Eliminado');
    });
});

/*============================================ CORROES DE LOS PACIENTES ============================================*/

app.get('/correo', (req, res) => {
    connection.query('SELECT * FROM cuen_pac', (err, results) => {
        if(err){
            console.error('Error al registrar');
            res.status(500).send('Error al registrar');
            return ;
        }
        res.json(results);
    });
});

app.get('/correo/:id', (req, res) => {
    const {id} = req.params;
    connection.query('SELECT * FROM cuen_pac WHERE id_pac = ?', [id], (err, results) => {
        if(err) throw err;
        res.send(results[0]);
    });
});

app.post('/correo', (req, res) => {
    const correo = req.body;
    const confirCorreo = req.body;
    const contraseña = req.body;
    connection.query('INSERT INTO cuen_pac SET ?', [correo, confirCorreo, contraseña], (err, results) => {
        if(err) throw err;
        res.send('Cuenta creada.');
    });
});

app.put('/correo/:id', (req, res) => {
    const {id} = req.params;
    const correo = req.body;
    const confirCorreo = req.body;
    const contraseña = req.body;
    connection.query('UPDATE cuen_pac SET ?, ?, ? WHERE id_pac = ?', [correo, confirCorreo, contraseña, id], (err, results) => {
        if(err) throw err;
        res.send('Cuenta modificada');
    });
});

app.delete('/correo/:id', (req, res) => {
    const {id} = req.params;
    connection.query('DELETE FROM cuen_pac WHERE id_pac = ?', [id], (err, results) => {
        if(err) throw err;
        res.send('Cuenta eliminada');
    });
});

app.listen(port, () => {
    console.log('Servidor corriendo');
});
