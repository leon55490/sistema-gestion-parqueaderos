// src/routes/usuario.routes.js
// Rutas de administración y consulta de usuarios

import { Router } from 'express';
import { param } from 'express-validator';
import * as usuarioController from '../controllers/usuario.controller.js';
import { autenticarUsuario, requiereRol } from '../middlewares/auth.js';
import { validar } from '../middlewares/validar.js';

const router = Router();

// Todas las rutas de usuarios requieren estar autenticado
router.use(autenticarUsuario);

// Solo administradores pueden listar todos los usuarios
router.get('/', requiereRol('administrador'), usuarioController.listar);

// Ver usuario por ID (cliente solo puede verse a sí mismo, admin a cualquiera)
router.get('/:id', [
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo')
], validar, usuarioController.obtener);

export default router;
