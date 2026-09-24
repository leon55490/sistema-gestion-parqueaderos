// src/controllers/auth.controller.js
// Capa de presentación para autenticación (registro, login, perfil, logout).

import * as usuarioService from '../services/usuario.service.js';

export function registro(req, res) {
  try {
    const resultado = usuarioService.registrar(req.body);
    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: resultado.usuario,
      token: resultado.token
    });
  } catch (error) {
    if (error.message === 'DATOS_INVALIDOS') {
      return res.status(400).json({ error: 'Nombre, correo y password son obligatorios' });
    }
    if (error.message === 'CORREO_INVALIDO') {
      return res.status(400).json({ error: 'El formato del correo electrónico no es válido' });
    }
    if (error.message === 'PASSWORD_CORTO') {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }
    if (error.message === 'ROL_INVALIDO') {
      return res.status(400).json({ error: 'El rol debe ser cliente o administrador' });
    }
    if (error.message === 'CORREO_DUPLICADO') {
      return res.status(409).json({ error: 'Ya existe un usuario registrado con este correo' });
    }

    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export function login(req, res) {
  try {
    const resultado = usuarioService.login(req.body);
    res.json({
      mensaje: 'Inicio de sesión exitoso',
      usuario: resultado.usuario,
      token: resultado.token
    });
  } catch (error) {
    if (error.message === 'DATOS_INVALIDOS') {
      return res.status(400).json({ error: 'Debe ingresar correo y contraseña' });
    }
    if (error.message === 'CREDENCIALES_INVALIDAS') {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export function perfil(req, res) {
  // req.usuario viene inyectado por el middleware autenticarUsuario
  res.json({
    usuario: req.usuario
  });
}

export function logout(req, res) {
  if (req.token) {
    usuarioService.logout(req.token);
  }
  res.json({ mensaje: 'Sesión cerrada correctamente' });
}
