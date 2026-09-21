// routes/espacio.routes.js — Enrutador manual de espacios
// Mapea método + ruta → función del controller.
// Esto es exactamente lo que Express hace con app.get(), app.post(), etc.
// Hacerlo a mano permite entender qué nos regalará el framework.

import * as controller from '../controllers/espacio.controller.js';
import { responderJson } from '../helpers/http.helpers.js';

/**
 * Recibe una petición ya identificada como /api/espacios y la despacha
 * al método correcto del controller según el verbo HTTP y si tiene :id.
 */
export function manejarRuta(req, res, url, partes) {
  // partes viene de url.pathname.split('/').filter(Boolean)
  // Ejemplo: '/api/espacios/2' → ['api', 'espacios', '2']
  const id = partes[2] ? Number(partes[2]) : null;

  // Si el id no es un número válido, responder 400
  if (partes[2] && (isNaN(id) || id <= 0)) {
    return responderJson(res, 400, { error: 'ID debe ser un número entero positivo' });
  }

  switch (req.method) {
    case 'GET':
      return id === null
        ? controller.listar(req, res, url)
        : controller.verUno(req, res, url, id);

    case 'POST':
      if (id !== null) {
        return responderJson(res, 400, { error: 'POST no acepta ID en la URL' });
      }
      return controller.crear(req, res);

    case 'PUT':
      if (id === null) {
        return responderJson(res, 400, { error: 'PUT requiere un ID en la URL' });
      }
      return controller.actualizar(req, res, url, id);

    case 'DELETE':
      if (id === null) {
        return responderJson(res, 400, { error: 'DELETE requiere un ID en la URL' });
      }
      return controller.eliminar(req, res, url, id);

    default:
      return responderJson(res, 405, { error: `Método ${req.method} no permitido` });
  }
}
