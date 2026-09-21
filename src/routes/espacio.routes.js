// src/routes/espacio.routes.js
// Mapa de URLs: qué método+ruta ejecuta qué controller.

import { Router } from 'express';
import * as controlador from '../controllers/espacio.controller.js';
import { requiereApiKey } from '../middlewares/apiKey.js';

const router = Router();

router.get('/', controlador.listar);
router.get('/:id', controlador.obtener);
router.post('/', controlador.crear);
router.put('/:id', controlador.actualizar);

// Reto 2: Protegiendo solo la ruta de eliminar con el middleware de API Key
router.delete('/:id', requiereApiKey, controlador.eliminar);

export default router;
