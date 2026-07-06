const Usuario = require('../models/usuarioSchema');
const bcrypt = require('bcrypt');

// 1. SOLUCIÓN: El Regex se declara aquí arriba (Global para el archivo)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{10,}$/;

exports.registerUsuario = async (req, res) => {
    try {
        const { email, password, nombre } = req.body;

        // Validamos usando el Regex global
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
        if (error.code === 11000) {
            return res.status(400).json({ error: "No se pudo completar el registro. Verifique sus datos." });
        }
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

exports.GetOne = async (req, res) => {
    try {
        // 2. SOLUCIÓN: Agregamos .select('-password') para no filtrar el hash
        const usuario = await Usuario.findById(req.params.id).select('-password');
        if (!usuario) {
            return res.status(404).json({ error: "El usuario no encontrado" });
        };
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ msg: "ID no válido", error: error.message });
    }
};

exports.UpdateOneUser = async (req, res) => {
    try {
        const { password, ...updateData } = req.body;

        if (password) {
            // Como el Regex ahora es global, esta línea ya funcionará perfectamente
            if (!passwordRegex.test(password)) {
                return res.status(400).json({ 
                    error: "La nueva contraseña no cumple con los requisitos de seguridad." 
                });
            }
            
            const salt = await bcrypt.genSalt(12);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const usuario = await Usuario.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!usuario) {
            return res.status(404).json({ error: "El usuario no encontrado" });
        }
        res.json({ msg: "Usuario actualizado", usuario });
    } catch (error) {
        console.error("ERROR REAL AL ACTUALIZAR:", error); 
        res.status(500).json({ 
            error: "Error al actualizar", 
            message: error.message || "Error desconocido" 
        });
    }
};

exports.DeleteOne = async (req, res) => {
    try {
        const usuario = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuario) {
            return res.status(404).json({ error: "El usuario no encontrado" });
        }
        res.json({ msg: "Usuario eliminado correctamente" });
    } catch (error) {
        // 3. SOLUCIÓN: Cambiado a error.message para evitar mensajes vacíos {}
        res.status(500).json({ error: "Error al eliminar", message: error.message });
    }
};