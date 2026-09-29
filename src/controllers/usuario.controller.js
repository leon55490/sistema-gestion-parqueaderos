// src/controllers/usuario.controller.js
// Capa de presentación para consulta y administración de usuarios.

import * as usuarioService from '../services/usuario.service.js';
import { prohibido } from '../errores.js';

export function listar(req, res, next) {
  try {
    const usuarios = usuarioService.obtenerTodos();
    res.json(usuarios);
  } catch(error) {
    next(error);
  }
}

export function obtener(req, res, next) {
  try {
    const id = Number(req.params.id);
    
    // Un cliente solo puede ver su propio perfil; el administrador puede ver cualquier perfil
    if (req.usuario.rol !== 'administrador' && req.usuario.id !== id) {
      throw prohibido('No tienes permiso para consultar el perfil de otro usuario');
    }

    const usuario = usuarioService.obtenerPorId(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch(error) {
    next(error);
  }
}
