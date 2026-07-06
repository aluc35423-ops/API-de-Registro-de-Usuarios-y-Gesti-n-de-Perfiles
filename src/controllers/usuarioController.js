const Usuario = require('../models/usuarioSchema');

const bcrypt = require ('bcrypt');

exports.registerUsuario = async (req, res) => {
    try {
        const { email, password, nombre } = req.body;

        // 1. Políticas de Complejidad (Regex)
        // Mínimo 10 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial
        // Se agregó el símbolo # dentro de los dos grupos de corchetes
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{10,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                error: "La contraseña debe tener al menos 10 caracteres, incluir mayúsculas, minúsculas, números y un carácter especial." 
            });
        }

        const usuario = await Usuario.findOne({ email });
        if (usuario) {
            return res.status(401).json({ error: "No se pudo completar el registro. Verifique sus datos." });
        }

        const salt = await bcrypt.genSalt(12);
        const newpassword = await bcrypt.hash(password, salt);

        const nuevoUsuario = new Usuario({
            nombre,
            email,
            password: newpassword
        });

        await nuevoUsuario.save();

        // Evitamos devolver la contraseña en la respuesta de creación
        const usuarioCreado = nuevoUsuario.toObject();
        delete usuarioCreado.password;

        res.status(201).json({ msg: "Usuario creado con éxito", usuario: usuarioCreado });

    } catch (error) {
        // Prevención de enumeración a nivel de base de datos (Error 11000 es duplicado en MongoDB)
        if (error.code === 11000) {
            return res.status(400).json({ error: "No se pudo completar el registro. Verifique sus datos." });
        }
        // Mensaje genérico para cualquier otro error
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

exports.GetOne = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ error: "El usuario no encontrado" });
        };
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ msg: "ID no válido", error: error.message });
    }
};