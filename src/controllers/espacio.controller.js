// src/controllers/espacio.controller.js
// Capa de presentación: traduce HTTP ↔ negocio.

import * as servicio from '../services/espacio.service.js';

export function listar(req, res, next) {
  try {
    const espacios = servicio.obtenerTodos({
      estado: req.query.estado,
      tipo: req.query.tipo
    });
    res.json(espacios);
  } catch(error) {
    next(error);
  }
}

export function obtener(req, res, next) {
  try {
    const id = Number(req.params.id);
    const espacio = servicio.obtenerPorId(id);
    if (!espacio) return res.status(404).json({ error: 'Espacio no encontrado' });
    
    res.json(espacio);
  } catch(error) {
    next(error);
  }
}

export function crear(req, res, next) {
  try {
    const nuevo = servicio.crear(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    next(error);
  }
}

export function actualizar(req, res, next) {
  try {
    const id = Number(req.params.id);
    const espacio = servicio.actualizar(id, req.body);
    if (!espacio) return res.status(404).json({ error: 'Espacio no encontrado' });
    res.json(espacio);
  } catch (error) {
    next(error);
  }
}

export function eliminar(req, res, next) {
  try {
    const id = Number(req.params.id);
    const eliminado = servicio.eliminar(id);
    if (!eliminado) return res.status(404).json({ error: 'Espacio no encontrado' });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
