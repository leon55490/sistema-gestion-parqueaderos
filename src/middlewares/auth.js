// src/middlewares/auth.js
// Middlewares para verificar autenticación y control de acceso basado en roles.

import * as usuarioService from '../services/usuario.service.js';

export function autenticarUsuario(req, res, next) {
  const headerAuth = req.headers.authorization;

  if (!headerAuth) {
    return res.status(401).json({ error: 'Token de autenticación no proporcionado. Incluye el header: Authorization: Bearer <token>' });
  }

  // Permite tanto "Bearer <token>" como "<token>" directo
  const token = headerAuth.startsWith('Bearer ') ? headerAuth.slice(7).trim() : headerAuth.trim();

  const usuario = usuarioService.obtenerPorToken(token);
  if (!usuario) {
    return res.status(401).json({ error: 'Token inválido o sesión expirada' });
  }

  // Inyectamos el usuario autenticado en la petición
  req.usuario = usuario;
  req.token = token;
  next();
}

export function requiereRol(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        error: `Acceso denegado: se requiere uno de los roles [${rolesPermitidos.join(', ')}]`
      });
    }

    next();
  };
}
