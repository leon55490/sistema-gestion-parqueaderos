// app.js — Enrutador principal de la aplicación
// Recibe TODAS las peticiones y las despacha al módulo de rutas correcto.
// Con Express esto será app.use('/api/espacios', espacioRouter).

import http from 'node:http';
import { responderJson } from './helpers/http.helpers.js';
import { manejarRuta as manejarEspacios } from './routes/espacio.routes.js';

const app = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const partes = url.pathname.split('/').filter(Boolean);
  // Ejemplo: '/api/espacios/2' → ['api', 'espacios', '2']

  // Log de cada petición (lo que Morgan haría en Express)
  console.log(`${new Date().toLocaleTimeString()} → ${req.method} ${url.pathname}`);

  try {
    // --- Ruta raíz: verificar que la API está viva ---
    if (url.pathname === '/' && req.method === 'GET') {
      return responderJson(res, 200, {
        mensaje: 'Sistema de Gestión de Parqueaderos - API activa',
        version: '1.0.0',
        endpoints: {
          espacios: '/api/espacios',
        },
      });
    }

    // --- Despachar a /api/espacios ---
    if (partes[0] === 'api' && partes[1] === 'espacios') {
      return await manejarEspacios(req, res, url, partes);
    }

    // --- Cualquier otra ruta: 404 ---
    return responderJson(res, 404, { error: 'Ruta no encontrada' });

  } catch (error) {
    // JSON malformado u otro error inesperado
    console.error('Error interno:', error.message);
    const codigo = error.message === 'JSON inválido' ? 400 : 500;
    return responderJson(res, codigo, { error: error.message });
  }
});

export default app;
