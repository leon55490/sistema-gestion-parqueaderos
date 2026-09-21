// src/controllers/espacio.controller.js
// Capa de presentación: traduce HTTP ↔ negocio.

import * as servicio from '../services/espacio.service.js';

export function listar(req, res) {
  // Los query params ya están disponibles en req.query gracias a Express
  const espacios = servicio.obtenerTodos({
    estado: req.query.estado,
    tipo: req.query.tipo
  });
  res.json(espacios);
}

export function obtener(req, res) {
  // Los parámetros de ruta están en req.params (siempre son strings)
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'ID debe ser un número entero positivo' });
  }

  const espacio = servicio.obtenerPorId(id);
  if (!espacio) return res.status(404).json({ error: 'Espacio no encontrado' });
  
  res.json(espacio);
}

export function crear(req, res) {
  try {
    const nuevo = servicio.crear(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    if (error.message === 'DATOS_INVALIDOS') return res.status(400).json({ error: 'Faltan campos obligatorios o están vacíos' });
    if (error.message === 'TIPO_INVALIDO') return res.status(400).json({ error: 'El tipo especificado no es válido' });
    if (error.message === 'ESTADO_INVALIDO') return res.status(400).json({ error: 'El estado especificado no es válido' });
    if (error.message === 'NUMERO_DUPLICADO') return res.status(409).json({ error: 'El número de espacio ya existe' });
    
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export function actualizar(req, res) {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) return res.status(400).json({ error: 'ID inválido' });

  try {
    const espacio = servicio.actualizar(id, req.body);
    if (!espacio) return res.status(404).json({ error: 'Espacio no encontrado' });
    res.json(espacio);
  } catch (error) {
    if (error.message === 'DATOS_INVALIDOS') return res.status(400).json({ error: 'Datos inválidos' });
    if (error.message === 'TIPO_INVALIDO') return res.status(400).json({ error: 'Tipo inválido' });
    if (error.message === 'ESTADO_INVALIDO') return res.status(400).json({ error: 'Estado inválido' });
    if (error.message === 'TIPO_NO_MODIFICABLE_SI_OCUPADO') return res.status(400).json({ error: 'No se puede cambiar el tipo de un espacio ocupado' });
    if (error.message === 'NUMERO_DUPLICADO') return res.status(409).json({ error: 'El número de espacio ya existe en otro registro' });

    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export function eliminar(req, res) {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) return res.status(400).json({ error: 'ID inválido' });

  try {
    const eliminado = servicio.eliminar(id);
    if (!eliminado) return res.status(404).json({ error: 'Espacio no encontrado' });
    res.status(204).end();
  } catch (error) {
    if (error.message === 'ELIMINAR_OCUPADO') return res.status(409).json({ error: 'No se puede eliminar un espacio ocupado' });
    if (error.message === 'ELIMINAR_RESERVADO') return res.status(409).json({ error: 'No se puede eliminar un espacio reservado' });
    
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
