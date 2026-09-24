// src/controllers/usuario.controller.js
// Capa de presentación para consulta y administración de usuarios.

import * as usuarioService from '../services/usuario.service.js';

export function listar(req, res) {
  const usuarios = usuarioService.obtenerTodos();
  res.json(usuarios);
}

export function obtener(req, res) {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'ID debe ser un número entero positivo' });
  }

  // Un cliente solo puede ver su propio perfil; el administrador puede ver cualquier perfil
  if (req.usuario.rol !== 'administrador' && req.usuario.id !== id) {
    return res.status(403).json({ error: 'No tienes permiso para consultar el perfil de otro usuario' });
  }

  const usuario = usuarioService.obtenerPorId(id);
  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  res.json(usuario);
}
