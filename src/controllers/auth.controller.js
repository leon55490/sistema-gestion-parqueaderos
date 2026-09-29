// src/controllers/auth.controller.js
// Capa de presentación para autenticación (registro, login, perfil, logout).

import * as usuarioService from '../services/usuario.service.js';

export function registro(req, res, next) {
  try {
    const resultado = usuarioService.registrar(req.body);
    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: resultado.usuario,
      token: resultado.token
    });
  } catch (error) {
    next(error);
  }
}

export function login(req, res, next) {
  try {
    const resultado = usuarioService.login(req.body);
    res.json({
      mensaje: 'Inicio de sesión exitoso',
      usuario: resultado.usuario,
      token: resultado.token
    });
  } catch (error) {
    next(error);
  }
}

export function perfil(req, res, next) {
  try {
    // req.usuario viene inyectado por el middleware autenticarUsuario
    res.json({
      usuario: req.usuario
    });
  } catch(error) {
    next(error);
  }
}

export function logout(req, res, next) {
  try {
    if (req.token) {
      usuarioService.logout(req.token);
    }
    res.json({ mensaje: 'Sesión cerrada correctamente' });
  } catch(error) {
    next(error);
  }
}
