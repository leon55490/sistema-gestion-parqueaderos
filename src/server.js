// server.js — Punto de entrada: arranca el servidor HTTP
// Separar app.js de server.js es una buena práctica:
// app.js define QUÉ hace el servidor, server.js define DÓNDE escucha.

import app from './app.js';

const PUERTO = process.env.PORT || 3000;

app.listen(PUERTO, () => {
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║  Sistema de Gestión de Parqueaderos               ║');
  console.log('║  API CRUD con HTTP nativo (sin framework)         ║');
  console.log(`║  Servidor escuchando en http://localhost:${PUERTO}      ║`);
  console.log('╚═══════════════════════════════════════════════════╝');
  console.log('');
  console.log('Endpoints disponibles:');
  console.log('  GET    /api/espacios              → listar todos');
  console.log('  GET    /api/espacios?estado=libre  → filtrar por estado');
  console.log('  GET    /api/espacios?tipo=moto     → filtrar por tipo');
  console.log('  GET    /api/espacios/:id           → ver uno');
  console.log('  POST   /api/espacios               → crear');
  console.log('  PUT    /api/espacios/:id           → actualizar');
  console.log('  DELETE /api/espacios/:id           → eliminar');
  console.log('');
});
