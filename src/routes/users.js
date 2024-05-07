const express = require("express");
const router = express.Router();
const pool = require("../database");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const upload = multer({ dest: "uploads/" }); // Directorio donde se guardarán temporalmente los archivos cargados
const JWT_SECRET = "Leito15001"; // Clave secreta para firmar el token cambiar por una talla segura

// Ruta para la página 'home'
router.get("/home", (req, res) => {
  res.send("Habla, niño");
});

// Ruta GET para obtener todos los usuarios
router.get("/users", (req, res) => {
  const query = "SELECT * FROM users;";

  pool
    .query(query)
    .then((result) => {
      res.json(result.rows); // Enviar la respuesta con los usuarios en formato JSON
    })
    .catch((error) => {
      console.error("Error al obtener usuarios:", error);
      res.status(500).json({ message: "Error al obtener usuarios" }); // Enviar un mensaje de error en caso de fallo
    });
});

// Ruta GET para obtener un usuario por ID
router.get("/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    // Obtener el usuario de la base de datos por su ID
    const query = "SELECT * FROM users WHERE id = $1";
    const result = await pool.query(query, [userId]);

    // Verificar si se encontró el usuario
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Devolver el usuario encontrado como respuesta
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ message: "Error al obtener usuario" });
  }
});

// Ruta POST para agregar un nuevo usuario
router.post("/users", upload.single("foto_documento"), async (req, res) => {
  const {
    nombre_apellidos,
    categoria,
    fecha_nacimiento,
    correo_electronico,
    genero,
    telefono,
    username,
    password,
  } = req.body;
  const foto_documento = req.file.path; // El archivo cargado como un búfer

  try {
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el usuario en la base de datos
    const query =
      "INSERT INTO users (nombre_apellidos, categoria, foto_documento, fecha_nacimiento, correo_electronico, genero, telefono, username, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id";
    const values = [
      nombre_apellidos,
      categoria,
      foto_documento,
      fecha_nacimiento,
      correo_electronico,
      genero,
      telefono,
      username,
      hashedPassword,
    ];

    const result = await pool.query(query, values);
    const userId = result.rows[0].id;

    // Generar un token de acceso
    const token = jwt.sign({ userId }, JWT_SECRET);

    // Devolver el token como respuesta
    res.status(201).json({ id: userId, token });
  } catch (error) {
    console.error("Error al insertar usuario:", error);
    res.status(500).json({ message: "Error al insertar el usuario" });
  }
});

// Ruta PATCH para actualizar parcialmente un usuario por ID
router.patch("/users/:id", async (req, res) => {
    const userId = req.params.id;
    const updates = req.body;
  
    try {
      // Verificar si el usuario existe antes de actualizarlo
      const userQuery = "SELECT * FROM users WHERE id = $1";
      const userResult = await pool.query(userQuery, [userId]);
  
      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      // Construir la consulta de actualización parcial
      let updateQuery = "UPDATE users SET";
      const values = [];
      let index = 1;
  
      // Construir la parte SET de la consulta con las actualizaciones recibidas
      for (const key in updates) {
        updateQuery += ` ${key} = $${index},`;
        values.push(updates[key]);
        index++;
      }
  
      // Eliminar la coma adicional al final de la consulta SET
      updateQuery = updateQuery.slice(0, -1);
  
      // Agregar la cláusula WHERE para actualizar el usuario específico
      values.push(userId); // Agregar el ID del usuario al array de valores
      updateQuery += ` WHERE id = $${index}`; // Agregar la cláusula WHERE a la consulta
  
      // Ejecutar la consulta de actualización parcial
      await pool.query(updateQuery, values);
  
      res.status(200).json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      res.status(500).json({ message: "Error al actualizar usuario" });
    }
  });
  

// Ruta DELETE para eliminar un usuario por ID
router.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    // Verificar si el usuario existe antes de eliminarlo
    const userQuery = "SELECT * FROM users WHERE id = $1";
    const userResult = await pool.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Eliminar el usuario de la base de datos
    const deleteQuery = "DELETE FROM users WHERE id = $1";
    await pool.query(deleteQuery, [userId]);

    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
});

// Ruta PUT para actualizar un usuario por ID
router.put("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const {
    nombre_apellidos,
    categoria,
    fecha_nacimiento,
    correo_electronico,
    genero,
    telefono,
    username,
    password,
  } = req.body;

  try {
    // Verificar si el usuario existe antes de actualizarlo
    const userQuery = "SELECT * FROM users WHERE id = $1";
    const userResult = await pool.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar el usuario en la base de datos
    const updateQuery = `
      UPDATE users 
      SET nombre_apellidos = $1, categoria = $2, fecha_nacimiento = $3, correo_electronico = $4, genero = $5, telefono = $6, username = $7, password = $8
      WHERE id = $9
    `;
    const values = [
      nombre_apellidos,
      categoria,
      fecha_nacimiento,
      correo_electronico,
      genero,
      telefono,
      username,
      password,
      userId,
    ];
    await pool.query(updateQuery, values);

    res.status(200).json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
});

module.exports = router;
