// src/routes/espacio.routes.js
// Mapa de URLs: qué método+ruta ejecuta qué controller.

import { Router } from 'express';
import { body, param, query } from 'express-validator';
import * as controlador from '../controllers/espacio.controller.js';
import { requiereApiKey } from '../middlewares/apiKey.js';
import { validar } from '../middlewares/validar.js';

const router = Router();

const reglasEspacio = [
  body('numero').trim().notEmpty().withMessage('El número es obligatorio'),
  body('tipo').trim().notEmpty().withMessage('El tipo es obligatorio').isIn(['carro', 'moto', 'bicicleta']).withMessage('Tipo inválido'),
  body('ubicacion').trim().notEmpty().withMessage('La ubicación es obligatoria'),
  body('estado').optional().trim().isIn(['libre', 'ocupado', 'reservado', 'mantenimiento']).withMessage('Estado inválido')
];

const reglasActualizar = [
  body('numero').optional().trim().notEmpty().withMessage('El número no puede estar vacío'),
  body('tipo').optional().trim().notEmpty().isIn(['carro', 'moto', 'bicicleta']).withMessage('Tipo inválido'),
  body('ubicacion').optional().trim().notEmpty().withMessage('La ubicación no puede estar vacía'),
  body('estado').optional().trim().isIn(['libre', 'ocupado', 'reservado', 'mantenimiento']).withMessage('Estado inválido')
];

router.get('/', [
  query('estado').optional().isIn(['libre', 'ocupado', 'reservado', 'mantenimiento']).withMessage('Filtro de estado inválido'),
  query('tipo').optional().isIn(['carro', 'moto', 'bicicleta']).withMessage('Filtro de tipo inválido')
], validar, controlador.listar);

router.get('/:id', [
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo')
], validar, controlador.obtener);

router.post('/', reglasEspacio, validar, controlador.crear);

router.put('/:id', [
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo'),
  ...reglasActualizar
], validar, controlador.actualizar);

router.delete('/:id', requiereApiKey, [
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo')
], validar, controlador.eliminar);

export default router;
