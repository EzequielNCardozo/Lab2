const express = require('express');
const mysql = require('mysql2/promise'); 
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

//CONEXION MYSQL
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'CAMBIAR LA CONTRASEÑA', //ACUERDENSE DE CAMBIAR ESTA CONTRASEÑA
    database: 'DB_ParLab'
});


function httpStatusFor(error) {
    return (error.sqlState === '45000' || error.errno === 1644) ? 409 : 500;
}

//PRODUCTOS

app.get('/api/productos', async (req, res) => {
    try {
        const [results] = await db.query('CALL SP_ListaProductosAll()');
        res.json(results[0]); // Al llamar SPs, mysql2 envuelve los resultados en un array extra
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/productos/:id', async (req, res) => {
    try {
        const [results] = await db.query('CALL SP_ListaProductosID(?)', [req.params.id]);
        if (results[0].length === 0) return res.status(404).json({ message: "Producto no encontrado" });
        res.json(results[0][0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/productos', async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        await db.query('CALL SP_AgregarProducto(?, ?)', [nombre, descripcion]);
        res.status(201).json({ message: "Producto agregado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/productos/:id', async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        await db.query('CALL SP_ActualizarProducto(?, ?, ?)', [req.params.id, nombre, descripcion]);
        res.json({ message: "Producto actualizado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/productos/:id', async (req, res) => {
    try {
        await db.query('CALL SP_EliminarProducto(?)', [req.params.id]);
        res.json({ message: "Producto eliminado" });
    } catch (error) {
        res.status(httpStatusFor(error)).json({ error: error.message });
    }
});

// Habilitar / inhabilitar producto (al inhabilitar: requiere stock 0 + motivo + responsable)
app.put('/api/productos/:id/estado', async (req, res) => {
    try {
        const { habilitado, motivo, ID_usuario } = req.body;
        await db.query('CALL SP_CambiarEstadoProducto(?, ?, ?, ?)', [
            req.params.id, habilitado ? 1 : 0, motivo || null, ID_usuario || null
        ]);
        res.json({ message: habilitado ? "Artículo habilitado" : "Artículo inhabilitado" });
    } catch (error) {
        res.status(httpStatusFor(error)).json({ error: error.message });
    }
});

// Usuarios

app.get('/api/usuarios', async (req, res) => {
    try {
        const [results] = await db.query('CALL SP_ListaUsuariosAll()');
        res.json(results[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/usuarios/:id', async (req, res) => {
    try {
        const [results] = await db.query('CALL SP_ListaUsuariosID(?)', [req.params.id]);
        if (results[0].length === 0) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json(results[0][0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/usuarios', async (req, res) => {
    try {
        const { usuario, nombre, apellido, contrasena, mail } = req.body;
        await db.query('CALL SP_AgregarUsuario(?, ?, ?, ?, ?)', [usuario, nombre, apellido, contrasena, mail]);
        res.status(201).json({ message: "Usuario creado" });
    } catch (error) {
        res.status(httpStatusFor(error)).json({ error: error.message });
    }
});

app.put('/api/usuarios/:id', async (req, res) => {
    try {
        const { usuario, nombre, apellido, contrasena, mail } = req.body;
        await db.query('CALL SP_ActualizarUsuario(?, ?, ?, ?, ?, ?)', [req.params.id, usuario, nombre, apellido, contrasena, mail]);
        res.json({ message: "Usuario actualizado" });
    } catch (error) {
        res.status(httpStatusFor(error)).json({ error: error.message });
    }
});

// Habilitar / inhabilitar usuario (al inhabilitar: motivo obligatorio + responsable)
app.put('/api/usuarios/:id/estado', async (req, res) => {
    try {
        const { habilitado, motivo, ID_usuario } = req.body; // 1 = habilitado, 0 = inhabilitado
        await db.query('CALL SP_CambiarEstadoUsuario(?, ?, ?, ?)', [
            req.params.id, habilitado ? 1 : 0, motivo || null, ID_usuario || null
        ]);
        res.json({ message: habilitado ? "Usuario habilitado" : "Usuario inhabilitado" });
    } catch (error) {
        res.status(httpStatusFor(error)).json({ error: error.message });
    }
});

app.delete('/api/usuarios/:id', async (req, res) => {
    try {
        await db.query('CALL SP_EliminarUsuario(?)', [req.params.id]);
        res.json({ message: "Usuario eliminado" });
    } catch (error) {
        res.status(httpStatusFor(error)).json({ error: error.message });
    }
});

// Login: valida credenciales y que el usuario este habilitado
app.post('/api/login', async (req, res) => {
    try {
        const { usuario, contrasena } = req.body;
        const [results] = await db.query('CALL SP_LoginUsuario(?, ?)', [usuario, contrasena]);
        if (results[0].length === 0) {
            return res.status(401).json({ error: "Usuario o contraseña incorrectos, o usuario inhabilitado." });
        }
        res.json(results[0][0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// STOCK

app.get('/api/stock', async (req, res) => {
    try {
        const [results] = await db.query('CALL SP_ListaStockAll()');
        res.json(results[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/stock/:id', async (req, res) => {
    try {
        const [results] = await db.query('CALL SP_ListaStockID(?)', [req.params.id]);
        res.json(results[0][0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/stock', async (req, res) => {
    try {
        const { ID_producto, cantidad } = req.body;
        await db.query('CALL SP_AgregarStock(?, ?)', [ID_producto, cantidad]);
        res.status(201).json({ message: "Stock inicial registrado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Movimiento de stock: tipo 'I' (ingreso/agregar) o 'E' (egreso/descontar).
app.post('/api/stock/movimiento', async (req, res) => {
    try {
        const { ID_producto, tipo, cantidad, observacion, ID_usuario } = req.body;
        const t = tipo === 'I' ? 'I' : 'E';
        await db.query('CALL SP_MovimientoStock(?, ?, ?, ?, ?)', [
            ID_producto, t, cantidad, observacion, ID_usuario
        ]);
        res.json({ message: t === 'I' ? "Ingreso registrado y auditoría guardada" : "Egreso registrado y auditoría guardada" });
    } catch (error) {
        res.status(httpStatusFor(error)).json({ error: error.message });
    }
});

app.delete('/api/stock/:id', async (req, res) => {
    try {
        await db.query('CALL SP_BorrarStock(?)', [req.params.id]);
        res.json({ message: "Registro de stock eliminado" });
    } catch (error) {
        res.status(httpStatusFor(error)).json({ error: error.message });
    }
});



app.get('/api/auditoria', async (req, res) => {
    try {
        const [results] = await db.query('CALL SP_ListaAuditoriaAll()');
        res.json(results[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});