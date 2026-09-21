// controllers/espacio.controller.js — Maneja las peticiones HTTP de espacios
// Recibe req/res, delega la lógica al service y responde con JSON.
// En la semana 4 esto será un router de Express; por ahora todo es manual.

import { responderJson, leerBody } from '../helpers/http.helpers.js';
import * as espacioService from '../services/espacio.service.js';

/** GET /api/espacios — listar todos (con filtros opcionales por query params) */
export async function listar(req, res, url) {
  const filtros = {};
  const estado = url.searchParams.get('estado');
  const tipo   = url.searchParams.get('tipo');
  if (estado) filtros.estado = estado;
  if (tipo)   filtros.tipo   = tipo;

  const espacios = espacioService.obtenerTodos(filtros);
  return responderJson(res, 200, espacios);
}

/** GET /api/espacios/:id — ver un espacio */
export async function verUno(req, res, url, id) {
  const espacio = espacioService.obtenerPorId(id);
  if (!espacio) return responderJson(res, 404, { error: 'Espacio no encontrado' });
  return responderJson(res, 200, espacio);
}

/** POST /api/espacios — crear un espacio nuevo */
export async function crear(req, res) {
  const body = await leerBody(req);
  if (!body) return responderJson(res, 400, { error: 'Body JSON requerido' });

  const resultado = espacioService.crear(body);
  if (resultado.error) return responderJson(res, resultado.codigo, { error: resultado.error });
  return responderJson(res, resultado.codigo, resultado.datos);
}

/** PUT /api/espacios/:id — actualizar un espacio */
export async function actualizar(req, res, url, id) {
  const body = await leerBody(req);
  if (!body) return responderJson(res, 400, { error: 'Body JSON requerido' });

  const resultado = espacioService.actualizar(id, body);
  if (resultado.error) return responderJson(res, resultado.codigo, { error: resultado.error });
  return responderJson(res, resultado.codigo, resultado.datos);
}

/** DELETE /api/espacios/:id — eliminar un espacio */
export async function eliminar(req, res, url, id) {
  const resultado = espacioService.eliminar(id);
  if (resultado.error) return responderJson(res, resultado.codigo, { error: resultado.error });
  return responderJson(res, resultado.codigo, null);
}
