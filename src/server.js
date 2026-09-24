// server.js — Punto de entrada: arranca el servidor HTTP
// Separar app.js de server.js es una buena práctica:
// app.js define QUÉ hace el servidor, server.js define DÓNDE escucha.

import app from './app.js';

const PUERTO = process.env.PORT || 3000;

app.listen(PUERTO, () => {
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║  Sistema de Gestión de Parqueaderos               ║');
  console.log('║  API CRUD migrada a Express (Semana 4)            ║');
  console.log(`║  Servidor escuchando en http://localhost:${PUERTO}      ║`);
  console.log('╚═══════════════════════════════════════════════════╝');
  console.log('');
  console.log('Endpoints disponibles:');
  console.log('  Autenticación:');
  console.log('    POST   /api/auth/registro         → registrarse');
  console.log('    POST   /api/auth/login            → iniciar sesión');
  console.log('    GET    /api/auth/perfil           → ver perfil propio (Bearer token)');
  console.log('    POST   /api/auth/logout           → cerrar sesión');
  console.log('  Usuarios:');
  console.log('    GET    /api/usuarios              → listar usuarios (solo admin)');
  console.log('    GET    /api/usuarios/:id          → ver usuario por ID');
  console.log('  Espacios:');
  console.log('    GET    /api/espacios              → listar todos');
  console.log('    GET    /api/espacios?estado=libre  → filtrar por estado');
  console.log('    GET    /api/espacios?tipo=moto     → filtrar por tipo');
  console.log('    GET    /api/espacios/:id           → ver uno');
  console.log('    POST   /api/espacios               → crear');
  console.log('    PUT    /api/espacios/:id           → actualizar');
  console.log('    DELETE /api/espacios/:id           → eliminar (requiere x-api-key)');
  console.log('');
});
