// src/services/usuario.service.js
// Capa de negocio: gestión de usuarios y autenticación.
// Por ahora almacena los usuarios y tokens en memoria (hardcoded).

import crypto from 'node:crypto';

// Usuarios precargados para pruebas
let usuarios = [
  {
    id: 1,
    nombre: 'Administrador Principal',
    correo: 'admin@parqueadero.com',
    password: 'admin123',
    rol: 'administrador',
    fecha_creacion: '2026-09-01T08:00:00.000Z'
  },
  {
    id: 2,
    nombre: 'Carlos Pérez',
    correo: 'carlos@cliente.com',
    password: 'cliente123',
    rol: 'cliente',
    fecha_creacion: '2026-09-10T10:30:00.000Z'
  },
  {
    id: 3,
    nombre: 'María Gómez',
    correo: 'maria@cliente.com',
    password: 'cliente123',
    rol: 'cliente',
    fecha_creacion: '2026-09-15T14:15:00.000Z'
  }
];

let siguienteId = 4;

// Mapa de sesiones activas: token -> usuarioId
const sesiones = new Map();

export const ROLES_VALIDOS = ['cliente', 'administrador'];

// Helper para no exponer la contraseña
function sanitizarUsuario(usuario) {
  if (!usuario) return null;
  const { password, ...usuarioSinPassword } = usuario;
  return usuarioSinPassword;
}

export function registrar(datos) {
  if (!datos.nombre || datos.nombre.trim() === '' ||
      !datos.correo || datos.correo.trim() === '' ||
      !datos.password || datos.password.trim() === '') {
    throw new Error('DATOS_INVALIDOS');
  }

  const correoLimpio = datos.correo.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(correoLimpio)) {
    throw new Error('CORREO_INVALIDO');
  }

  if (datos.password.length < 6) {
    throw new Error('PASSWORD_CORTO');
  }

  const rol = datos.rol ? datos.rol.trim().toLowerCase() : 'cliente';
  if (!ROLES_VALIDOS.includes(rol)) {
    throw new Error('ROL_INVALIDO');
  }

  if (usuarios.some((u) => u.correo.toLowerCase() === correoLimpio)) {
    throw new Error('CORREO_DUPLICADO');
  }

  const nuevoUsuario = {
    id: siguienteId++,
    nombre: datos.nombre.trim(),
    correo: correoLimpio,
    password: datos.password,
    rol,
    fecha_creacion: new Date().toISOString()
  };

  usuarios.push(nuevoUsuario);

  // Generar token para inicio de sesión inmediato al registrarse
  const token = crypto.randomUUID();
  sesiones.set(token, nuevoUsuario.id);

  return {
    usuario: sanitizarUsuario(nuevoUsuario),
    token
  };
}

export function login({ correo, password }) {
  if (!correo || correo.trim() === '' || !password || password.trim() === '') {
    throw new Error('DATOS_INVALIDOS');
  }

  const correoLimpio = correo.trim().toLowerCase();
  const usuario = usuarios.find((u) => u.correo.toLowerCase() === correoLimpio);

  if (!usuario || usuario.password !== password) {
    throw new Error('CREDENCIALES_INVALIDAS');
  }

  const token = crypto.randomUUID();
  sesiones.set(token, usuario.id);

  return {
    usuario: sanitizarUsuario(usuario),
    token
  };
}

export function logout(token) {
  if (!token) return false;
  return sesiones.delete(token);
}

export function obtenerPorToken(token) {
  if (!token || !sesiones.has(token)) return null;
  const usuarioId = sesiones.get(token);
  const usuario = usuarios.find((u) => u.id === usuarioId);
  return sanitizarUsuario(usuario);
}

export function obtenerTodos() {
  return usuarios.map(sanitizarUsuario);
}

export function obtenerPorId(id) {
  const usuario = usuarios.find((u) => u.id === id);
  return sanitizarUsuario(usuario);
}
