const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

/**
 * @swagger
 * tags:
 *   - name: Usuarios
 *     description: API de Registro de Usuarios y Gestión de Perfiles
 */

/**
 * @swagger
 * /api/usuarios/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "juan@apirugp.edu"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Apirugp12#"
 *               nombre:
 *                 type: string
 *                 example: "Juan"
 *     responses:
 *       201:
 *         description: Usuario creado con éxito
 *       400:
 *         description: Datos inválidos
 */
router.post("/register", usuarioController.registerUsuario);

/**
 * @swagger
 * /api/usuarios/perfil/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/perfil/:id", usuarioController.GetOne);

module.exports = router;