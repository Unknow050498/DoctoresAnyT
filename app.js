const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { Client } = require('pg')
const bodyParser = require('body-parser');

app.get('/', (req, res) => {
    res.send('¡Hola Mundo!');
  });

app.use(bodyParser.json());

const connection = new Client({
    host: 'ec2-44-214-132-149.compute-1.amazonaws.com',
    user: 'ynrnjuotlsnzmv',
    password: '5e76919f62db03cb53671f82817f703cd0bf2bf12eb9f623f74172b347bd6b5e',
    database: 'd3obvvpm9robqg',
    port: 5432
});

connection.connect((err) => {
    if (err) {
        console.error('No se puede conectar a la Base de Datos', err);
        return;
    }
    console.log('Conexión establecida a la Base de Datos');
});

app.get('/px', (req, res) => {
    connection.query('SELECT * FROM pacientes', (err, results) => {
        if (err) {
            console.error('Error al registrar');
            res.status(500).send('Error al registrar');
            return;
        }
        res.json(results);
    });
});

app.get('/px/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM pacientes WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.send(results[0]);
    });
});

app.post('/px', (req, res) => {
    const nombre = req.body;
    const paterno = req.body;
    const materno = req.body;
    connection.query('INSERT INTO pacientes SET ?', [nombre, paterno, materno], (err, results) => {
        if (err) throw err;
        res.send('Paciente creado');
    });
});

app.put('/px/:id', (req, res) => {
    const { id } = req.params;
    const nombre = req.body;
    const paterno = req.body;
    const materno = req.body;
    connection.query('UPDATE pacientes SET ?, ?, ? WHERE id = ?', [nombre, paterno, materno, id], (err, results) => {
        if (err) throw err;
        res.send('Paciente modificado');
    });
});

app.delete('/px/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM pacientes WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.send('Paciente Eliminado');
    });
});

/*============================================ CORROES DE LOS PACIENTES ============================================*/

app.get('/correo', (req, res) => {
    connection.query('SELECT * FROM cuentas_px', (err, results) => {
        if (err) {
            console.error('Error al mostrar las cuentas');
            res.status(500).send('No se pueden mostrar las cuentas');
            return;
        }
        res.json(results.rows);
    });
});

app.get('/correo/:id', (req, res) => {
    const { id } = req.params;

    try {
        connection.query('SELECT * FROM cuentas_px WHERE id_px = $1', [id], (err, results) => {
            if (results.rows.length > 0) {
                res.json(results.rows[0]);
            } else {
                res.status(404).json({ error: 'Usuario no encontrado ' });
            }
        });

    } catch (err) {
        console.error('Error al obtener usuario', err);
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
});

app.post('/correo', (req, res) => {
    const { correo, conf_corr, contraseña } = req.body;

    connection.query('INSERT INTO cuentas_px (correo, conf_corr, contraseña) VALUES ($1, $2, $3)', [correo, conf_corr, contraseña], (err, results) => {
        if (err) {
            console.error('Error al insertar datos: ', err);
            res.status(500).send('Error al insertar datos');
        } else {
            res.status(201).send('Datos isnertados correctamente');
        }
    });
});

app.put('/correo/:id', (req, res) => {
    const id = req.params.id;
    const { correo, conf_corr, contraseña } = req.body;
    connection.query('UPDATE cuentas_px SET correo = $1, conf_corr = $2, contraseña = $3 WHERE id_px = $4', [correo, conf_corr, contraseña, id], (err, results) => {
        if (err) {
            console.error('Error al modificar', err);
            res.status(500).send('Error al modificar');
        } else {
            res.status(200).send('Cuenta modificada');
        }
    });
});

app.delete('/correo/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM cuentas_px WHERE id_px = $1', [id], (err, results) => {
        if (err) throw err;
        res.send('Cuenta eliminada');
    });
});

app.listen(port, () => {
    console.log('Servidor corriendo', port);
});

