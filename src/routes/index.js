const express = require("express");
const router = express.Router();
const pool = require('../database')
const multer = require('multer');
const path = require('path');

// Configuración de multer para subir archivos
const upload = multer({ dest: path.join(__dirname, '../uploads/') }); // Directorio donde se guardarán las imágenes

// Ruta para la página 'home'
router.get("/home", (req, res) => {
    res.send("Habla, niño");
});

// Ruta GET para obtener todos los usuarios
router.get('/users', (req, res) => {
  const query = 'SELECT * FROM users;';

  pool.query(query)
      .then(result => {
          res.json(result.rows); // Enviar la respuesta con los usuarios en formato JSON
      })
      .catch(error => {
          console.error('Error al obtener usuarios:', error);
          res.status(500).json({ message: 'Error al obtener usuarios' }); // Enviar un mensaje de error en caso de fallo
      });
});







module.exports = router;


